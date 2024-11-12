import { Button, Center, Container, Fieldset, FileInput, Flex, Text, TextInput } from '@mantine/core'

import '@mantine/core/styles.css';
import { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import classes from './app.module.css';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function App() {

  const [link, setLink] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const cardRef = useRef(null);


  // Handle logo upload with FileInput
  const handleLogoUpload = (file: Blob) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e?.target?.result && typeof e.target.result === 'string') {
          setPreviewUrl(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert mm to pixels (assuming 96 DPI)
  const mmToPx = (mm: number) => Math.round(mm * 3.7795275591);

  const cardWidth = mmToPx(84);
  const cardHeight = mmToPx(55);

  const handleExport = async () => {
    if (!cardRef.current) return;

    try {
      // Create a canvas from the card
      const canvas = document.createElement('canvas');
      canvas.width = cardWidth;
      canvas.height = cardHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Failed to get 2D context');
      }
      // draw white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, cardWidth, cardHeight);

      // concrt HTML content to dataURL
      const data = await html2canvas(cardRef.current, {
        width: cardWidth,
        height: cardHeight,
        scale: 2, // higher resolution
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [84, 55]
      })

      pdf.addImage(
        data.toDataURL('image/png', 1.0),
        'PNG',
        0,
        0,
        84,
        55
      )

      // Save the PDF
      pdf.save('business-card.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  }

  return (
    <div>
      <Container h="100vh" mt={'50px'}>

        <Fieldset legend="Business Card Details">
          <FileInput
            label="Logo"
            description="upload a square logo"
            placeholder="Choose a logo"
            accept='image/*'
            onChange={handleLogoUpload}
          />
          <TextInput
            label="QR code link"
            placeholder='https://www.example.com'
            onChange={(e) => {
              const value = e.target.value;
              setLink(value);
            }}
          />
        </Fieldset>


        <Fieldset legend="Preview">
          <Container ref={cardRef} className={classes.previewCard} size={cardWidth} h={cardHeight} >
            <Flex direction="row" h="100%" justify="center" align="center">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Logo"
                  className="max-w-full max-h-full object-contain"
                  width='100px'
                />
              )}
              <Flex direction="column" align="center" justify="center" gap={10}>
                <Text size='md' fw={500} ta="center">
                  Thanks for your custom!<br />
                  Give us 5 stars by scanning below.
                </Text>
                {link && (
                  <QRCode value={link} size={80} />
                )}
              </Flex>
            </Flex>

          </Container>
          <Center mt={50}>
            <Button onClick={handleExport} size='lg'>Download to PDF</Button>
          </Center>
        </Fieldset>

      </Container>

    </div >
  )
}

export default App

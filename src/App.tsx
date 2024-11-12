import { Container, Fieldset, FileInput, TextInput } from '@mantine/core'

import '@mantine/core/styles.css';
import { useState } from 'react';
import QRCode from 'react-qr-code';


function App() {

  const [logo, setLogo] = useState(null);
  const [link, setLink] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);


  // Handle logo upload with FileInput
  const handleLogoUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
        setLogo(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Container h="100vh">

        <Fieldset legend="Business Card Details">
          <FileInput
            label="Logo"
            description="upload a square logo"
            placeholder="Choose a logo"
            accept='image/*'
            onChange={handleLogoUpload}
          />
          <TextInput label="QR code link" placeholder='Enter a link to generate a QR code' onChange={(e) => setLink(e.target.value)} />
        </Fieldset>


        <h3>Preview</h3>
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Logo"
            className="max-w-full max-h-full object-contain"
          />
        )}

        <p>{link}</p>
        <QRCode value={link} size={256} />

      </Container>
    </div>
  )
}

export default App

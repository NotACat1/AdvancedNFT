import { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { XCircleFill, Upload } from 'react-bootstrap-icons';
import { usePinata } from '@hooks/usePinata';
import { useMintNFT } from '@hooks/useMintNFT';
import { useContractStats } from '@hooks/useContractStats';
import { useAccount } from 'wagmi';
import { FormatUtils } from '@utils/FormatUtils';

export const MintForm: React.FC = () => {
  const { stats } = useContractStats();
  const maxRoyaltyFee = FormatUtils.parseFeeToPercent(stats?.stats.maxRoyaltyFee || BigInt(0));

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [royaltyPercent, setRoyaltyPercent] = useState(maxRoyaltyFee);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { address } = useAccount();
  const { uploadFileToIpfs, uploadJsonToIpfs } = usePinata();
  const { mintNFT, isMinting, error: mintError } = useMintNFT();

  // Supported file formats
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateFile(e.target.files[0]);
    }
  };

  // File validation
  const validateFile = (selectedFile: File) => {
    const newErrors: Record<string, string> = {};

    if (!SUPPORTED_FORMATS.includes(selectedFile.type)) {
      newErrors.file = 'Only JPG, PNG, GIF and WebP formats are supported';
    } else if (selectedFile.size > MAX_FILE_SIZE) {
      newErrors.file = 'File is too large (max 10MB)';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  // Paste handler (Ctrl+V)
  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (e.clipboardData?.files.length) {
      const pastedFile = e.clipboardData.files[0];
      validateFile(pastedFile);
      e.preventDefault();
    }
  }, []);

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!file) newErrors.file = 'Please select a file';
    if (!name.trim()) newErrors.name = 'Please enter a name';
    if (!description.trim()) newErrors.description = 'Please enter a description';
    if (isNaN(Number(price)) || Number(price) < 0) newErrors.price = 'Please enter a valid price';
    if (
      isNaN(Number(royaltyPercent)) ||
      Number(royaltyPercent) < 0 ||
      Number(royaltyPercent) > 10
    ) {
      newErrors.royaltyPercent = 'Please enter a valid royalty percentage (0-10%)';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && file) {
      try {
        setIsSubmitting(true);
        setErrors({});
        setIsSuccess(false);

        // 1. Upload file to IPFS
        const fileUploadResult = await uploadFileToIpfs(file, {
          name: `${name}_${Date.now()}`,
          keyvalues: {
            creator: address || 'unknown',
            type: 'nft',
          },
        });

        // 2. Create metadata
        const metadata = {
          name,
          description,
          image: `ipfs://${fileUploadResult.hash}`,
          external_url: '',
          attributes: [],
          created_by: address,
          timestamp: new Date().toISOString(),
        };

        // 3. Upload metadata to IPFS
        const metadataUploadResult = await uploadJsonToIpfs(metadata, {
          name: `${name}_metadata`,
          keyvalues: {
            type: 'nft-metadata',
          },
        });

        setIpfsHash(metadataUploadResult.hash || '');

        // 4. Mint NFT
        await mintNFT({
          ipfsURI: `ipfs://${metadataUploadResult.hash}`,
          price: price,
          royaltyPercent: royaltyPercent,
        });

        // Success state
        setIsSuccess(true);
        resetForm();
      } catch (err) {
        let errorMessage = 'Failed to create NFT';

        if (err instanceof Error) {
          errorMessage = err.message;

          // Handle specific errors
          if (err.message.includes('user rejected transaction')) {
            errorMessage = 'Transaction was canceled';
          } else if (err.message.includes('insufficient funds')) {
            errorMessage = 'Insufficient funds for transaction';
          } else if (err.message.includes('Pinata')) {
            errorMessage = 'Error uploading to IPFS';
          }
        }

        setErrors((prev) => ({
          ...prev,
          form: errorMessage,
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFile(null);
    setPreview(null);
    setName('');
    setDescription('');
    setPrice('0');
    setRoyaltyPercent(maxRoyaltyFee);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove file
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Add paste event listener
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  return (
    <>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="mb-4">Create NFT</h1>

          {isSuccess && (
            <Alert variant="success" className="mb-4">
              <Alert.Heading>NFT Created Successfully!</Alert.Heading>
              <p>Your NFT has been minted and stored on IPFS.</p>
              {ipfsHash && (
                <p className="mb-0">
                  IPFS Hash: <code>{ipfsHash}</code>
                </p>
              )}
            </Alert>
          )}

          {(mintError || errors.form) && (
            <Alert variant="danger" className="mb-4">
              {mintError || errors.form}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* NFT Name */}
            <Form.Group className="mb-3">
              <Form.Label>NFT Name*</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter NFT name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isInvalid={!!errors.name}
              />
              {errors.name && (
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              )}
            </Form.Group>

            {/* File upload field */}
            <Form.Group className="mb-3">
              <Form.Label>NFT File*</Form.Label>

              <div
                className={`drop-zone ${!preview ? 'border-dashed' : ''} p-4 rounded-3 bg-light`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: 'pointer', minHeight: '200px' }}
              >
                {preview ? (
                  <div className="position-relative">
                    <Card.Img
                      variant="top"
                      src={preview}
                      className="rounded-3"
                      style={{ maxHeight: '300px', objectFit: 'contain' }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      className="position-absolute top-0 end-0 m-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                    >
                      <XCircleFill size={20} />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload size={48} className="mb-3 text-muted" />
                    <p className="mb-1">Drag and drop file here or click to select</p>
                    <p className="text-muted small">Supports JPG, PNG, GIF, WebP (max 10MB)</p>
                    <p className="text-muted small">Or use Ctrl+V to paste</p>
                  </div>
                )}

                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="d-none"
                  isInvalid={!!errors.file}
                />
              </div>

              {errors.file && <Form.Text className="text-danger">{errors.file}</Form.Text>}
            </Form.Group>

            {/* NFT Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description*</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your NFT..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                isInvalid={!!errors.description}
              />
              {errors.description && (
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Price */}
            <Form.Group className="mb-3">
              <Form.Label>Price (ETH)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                isInvalid={!!errors.price}
              />
              {errors.price && (
                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Royalty Percentage */}
            <Form.Group className="mb-4">
              <Form.Label>Royalty Percentage (0-{maxRoyaltyFee}%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="10"
                min="0"
                max={maxRoyaltyFee}
                step="0.1"
                value={royaltyPercent}
                onChange={(e) => setRoyaltyPercent(e.target.value)}
                isInvalid={!!errors.royaltyPercent}
              />
              {errors.royaltyPercent && (
                <Form.Control.Feedback type="invalid">
                  {errors.royaltyPercent}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Create button */}
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                size="lg"
                disabled={isSubmitting || isMinting}
              >
                {isSubmitting || isMinting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                  </>
                ) : (
                  'Create NFT'
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
};

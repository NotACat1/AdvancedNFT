import React, { useEffect, useState } from 'react';
import { Container, Badge, Accordion, ListGroup } from 'react-bootstrap';
import { CodeSquare, Github } from 'react-bootstrap-icons';

export const LicensePage: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'MyNFT | License Agreement';
  }, []);

  const licenseComponents = [
    {
      name: 'React',
      license: 'MIT',
      version: '18.2.0',
      link: 'https://github.com/facebook/react/blob/main/LICENSE',
    },
    {
      name: 'Bootstrap',
      license: 'MIT',
      version: '5.2.3',
      link: 'https://github.com/twbs/bootstrap/blob/main/LICENSE',
    },
    {
      name: 'Web3.js',
      license: 'MIT',
      version: '4.1.1',
      link: 'https://github.com/ChainSafe/web3.js/blob/4.x/LICENSE',
    },
    {
      name: 'Ethers.js',
      license: 'MIT',
      version: '6.7.1',
      link: 'https://github.com/ethers-io/ethers.js/blob/master/LICENSE.md',
    },
  ];

  const toggleSection = (key: string) => {
    setActiveKey(activeKey === key ? null : key);
  };

  return (
    <Container className="py-4 license-page">
      <div className="d-flex align-items-center mb-4">
        <CodeSquare className="me-2 text-primary" size={28} />
        <div>
          <h1 className="mb-0">Software License</h1>
          <div className="d-flex align-items-center mt-2">
            <Badge bg="dark" className="me-2">
              MIT License
            </Badge>
            <small className="text-muted">
              Copyright (c) {new Date().getFullYear()} MyNFT Marketplace
            </small>
          </div>
        </div>
      </div>

      <div className="alert alert-info mb-4">
        <p className="mb-0">
          This license governs use of the MyNFT Marketplace software and associated services. By
          using our platform, you agree to the terms below.
        </p>
      </div>

      <Accordion activeKey={activeKey} onSelect={toggleSection} flush className="mb-4">
        <Accordion.Item eventKey="terms" className="border-0 mb-3">
          <Accordion.Header className="bg-light p-3 rounded">
            <div className="d-flex justify-content-between w-100 pe-2">
              <h4 className="mb-0">License Terms</h4>
            </div>
          </Accordion.Header>
          <Accordion.Body className="p-4">
            <div className="license-text">
              <p className="mb-3">
                Permission is hereby granted, free of charge, to any person obtaining a copy of this
                software and associated documentation files (the "Software"), to deal in the
                Software without restriction, including without limitation the rights to use, copy,
                modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
                and to permit persons to whom the Software is furnished to do so, subject to the
                following conditions:
              </p>

              <p className="mb-3">
                The above copyright notice and this permission notice shall be included in all
                copies or substantial portions of the Software.
              </p>

              <p className="mb-0">
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
                HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
                CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
                OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
              </p>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="restrictions" className="border-0 mb-3">
          <Accordion.Header className="bg-light p-3 rounded">
            <div className="d-flex justify-content-between w-100 pe-2">
              <h4 className="mb-0">Special Restrictions</h4>
            </div>
          </Accordion.Header>
          <Accordion.Body className="p-4">
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex align-items-start py-3">
                <span className="badge bg-warning text-dark me-3">1</span>
                <div>
                  <h6 className="mb-1">Blockchain Components</h6>
                  <p className="mb-0">
                    Smart contract code is licensed separately under GPL-3.0 for community
                    protection
                  </p>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex align-items-start py-3">
                <span className="badge bg-warning text-dark me-3">2</span>
                <div>
                  <h6 className="mb-1">Branding</h6>
                  <p className="mb-0">
                    The MyNFT name and logo may not be used without explicit permission
                  </p>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex align-items-start py-3">
                <span className="badge bg-warning text-dark me-3">3</span>
                <div>
                  <h6 className="mb-1">Commercial Use</h6>
                  <p className="mb-0">
                    Enterprise deployments require a commercial license agreement
                  </p>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="bg-light rounded p-4 mb-4">
        <h4 className="mb-3 d-flex align-items-center">
          <Github className="me-2" />
          Open Source Components
        </h4>
        <p className="mb-4">This software incorporates the following open source components:</p>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Component</th>
                <th>License</th>
                <th>Version</th>
                <th>Links</th>
              </tr>
            </thead>
            <tbody>
              {licenseComponents.map((component, index) => (
                <tr key={index}>
                  <td>{component.name}</td>
                  <td>
                    <Badge bg="secondary">{component.license}</Badge>
                  </td>
                  <td>{component.version}</td>
                  <td>
                    <a
                      href={component.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      View License
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mb-0 mt-3">
          For complete license information of all dependencies, please visit our{' '}
          <a
            href="https://github.com/TEST/licenses"
            target="_blank"
            rel="noopener noreferrer"
            className="fw-semibold"
          >
            GitHub repository
          </a>
          .
        </p>
      </div>

      <div className="border-top pt-4">
        <h5 className="mb-3">License Interpretation</h5>
        <p>
          For any questions regarding license terms or permissions, please contact our legal team at{' '}
          <a href="mailto:legal@mynft.example">legal@mynft.example</a>. Official translations are
          available upon request.
        </p>
      </div>
    </Container>
  );
};

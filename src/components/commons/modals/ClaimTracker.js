import { useEffect, useState } from "react";
import { Modal, Container, Button, Row, Col } from "react-bootstrap";

const ClaimTracker = (props) => {
  const [tracks, setTracks] = useState([]);

  const handleClose = () => {
    setTracks([]);
    props.onHide();
  };

  useEffect(() => {
    if (props.claim !== undefined || props.claim !== null) {
      props.claim && props.claim.tracking
        ? setTracks(props.claim.tracking)
        : setTracks([]);
    }
  }, [props.claim]);

  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Track Claim - {props.claim && props.claim.title}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Container fluid>
            <Row style={{ marginBottom: 20 }}>
              <Col>
                {tracks.length > 0 ? (
                  tracks.map((track) => (
                    <div
                      key={track.id}
                      className={`alert alert-${
                        track.remarks === null ? "danger" : "success"
                      }`}
                    >
                      {track.remarks === null
                        ? `Batch has not been cleared by ${track.stage}`
                        : track.remarks}
                    </div>
                  ))
                ) : (
                  <div className="alert alert-danger">
                    There is no tracking information for this claim!!
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ClaimTracker;

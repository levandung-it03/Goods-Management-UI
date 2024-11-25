import { createPortal } from 'react-dom';
import { cloneElement } from 'react';
import './Dialog.scss';

const Dialog = ({ dialogContent, setDialogContent }) => {
    return dialogContent
        ? createPortal(
              <div className="dialog" onClick={() => setDialogContent()}>
                  <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
                      {cloneElement(dialogContent, { onClose: () => setDialogContent() })}
                  </div>
              </div>,
              document.getElementById('root'), // Take Dialog outside the original DOM structure
          )
        : null;
};

export default Dialog;

// function DialogCompoExample() {
//     // Dialog
//     const [dialogContent, setDialogContent] = useState();
//     return (
//         <>
//             <button onClick={() => setDialogContent(<div>Dialog Content 1</div>)}>Open dialog 1</button>
//             <button onClick={() => setDialogContent(<div>Dialog Content 2</div>)}>Open dialog 2</button>
//             <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
//         </>
//     );
// }

// export default DialogCompoExample;

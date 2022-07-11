import {useEffect, useRef, MutableRefObject, useState} from "react";
import styles from "./ErrorModal.module.css";
import store from "../../store";
import {setError} from "../../reducers/error";

function hookCloseClick(ref: MutableRefObject<null>) {
    useEffect(() => {
        async function close() {
            let bg = ref.current as unknown as Element;
            bg.classList.add(styles.out);
            let card = bg.firstChild as Element;
            card.classList.add(styles.out);
            await new Promise(r => setTimeout(r, 500));  // waits for a constant 1sec timeout for the animation

            store.dispatch(setError(""));  // null out error, closing the modal
        }
        async function handleClick(event: Event) {
            // absolute meme of a type cast because it expect nodes which we don't have until render-time
            let cur = event.target as Element // ref.current as unknown as Node;
            if (ref.current && (cur.className == styles.error_background || cur.className == styles.error_x)) {
                await close();
            }
        }
        async function handleEsc(event: KeyboardEvent) {
            if (event.key === "Escape")
                await close();
        }
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("keydown", handleEsc);  // keyboard shortcut: close popup on Esc
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [ref]);
}

function ErrorModal() {
    const [error, setError] = useState("");
    store.subscribe(async () => {
        if (store.getState().error.value !== error) {
                setError(store.getState().error.value);
        }
    })
    const ref = useRef(null);
    hookCloseClick(ref);
    return (error) ? (
        <div className={styles.error_background} ref={ref}>
            <div className={styles.error_window}>
                <button className={styles.error_x}>×</button>
                    <div className={styles.error_text}><h1>ERROR</h1> <p> {error} </p> </div>
            </div>
        </div>
    ) : (<></>)
}

export default ErrorModal;

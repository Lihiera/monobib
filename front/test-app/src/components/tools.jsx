import styles from '../../styles/tools.module.css'


function MyButton({ onClick, text, fontSize }) {
    return (
        <button className={styles.btn} onClick={onClick} style={{ fontSize: fontSize, width:'10em', height:'2em' }}>{text}</button>
    );
}


function MyImage({ src, ...props }) {
    const url = new URL(src, import.meta.url).href;
    return <img src={url} {...props} />;
}


export { MyButton, MyImage };

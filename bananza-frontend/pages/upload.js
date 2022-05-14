import PageHead from "/components/general/pageHead";
import Nav from "/components/general/nav";
import Input from "/components/forms/input";
import styles from "../styles/upload.module.css";

export default function Upload(props) {
  return (
    <>
      <PageHead title="Bananza - Edit Profile" />
      <Nav />
      <form className={styles.uploadForm}>
          <h2>Upload video</h2>
        <div className={styles.formWrap}>
          <div className="formFields">
            <div className={styles.formColumn}>
              <Input
                label="Video title"
                name="title"
                placeholderText="Video title"
              />
              <Input
                label="Video description"
                name="description"
                placeholderText="Video description"
              />
            </div>
            <div className={styles.formColumn}>
              <label for="thumbnail">
                Video thumbnail
                <input name="thumbnail" id="thumbnail" type="file" />
              </label>
            </div>
            <div className={styles.formColumn}>
              <label for="video">
                Video title
                <input name="video" id="video" type="file" />
              </label>
            </div>
          </div>
        </div>
        <button className={styles.submitButton}>Upload</button>
      </form>
    </>
  );
}

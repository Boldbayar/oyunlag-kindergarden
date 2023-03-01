import { Formik, Field, Form, FormikHelpers } from 'formik';
import { useState } from 'react';
import qr from 'qrcode';
import styles from './login-form.module.css'

interface Values {
    regNum: string;
}

export default function LoginForm() {
  const [qr, setQR] = useState("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");
  const [regNum, setRegNum] = useState("");

    return (
      <div className={styles.login_box + ' p-3'}>
        {/* <h1 className="display-6 mb-3">Төлбөр төлөлт</h1> */}
        <Formik
          initialValues={{
            regNum: '',
          }}

          onSubmit={( 
            values: Values,
            { setSubmitting }: FormikHelpers<Values>
          ) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 500);
          }}

        >
          <Form>
            <div className="mb-3">
              <Field className="form-control" id="regNum" name="regNum" placeholder="Регистерийн дугаар" aria-describedby="usernameHelp" />
            </div>
            <div className={styles.login_button}>
              <button type="submit" className="btn btn-secondary">Цэвэрлэх</button>
              <button type="submit" className="btn btn-primary">Төлбөр төлөх</button>
            </div>
            <img src={`data:image/png;base64,${qr}`}/>
          </Form>
        </Formik>
      </div>
    );
  };
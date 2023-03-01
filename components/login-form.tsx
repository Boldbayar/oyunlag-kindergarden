import { Formik, Field, Form, FormikHelpers, ErrorMessage } from 'formik';
import { useState } from 'react';
import styles from './login-form.module.css'
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Values {
    regNum: string;
}

export default function LoginForm() {
  const [qr, setQR] = useState("");
  const [regNum, setRegNum] = useState("");

  async function fetchQr() {
    const response = await fetch('http://stud.oyunlag.edu.mn:8081/api/kinder-garden/charge-initiate?regNum=' + regNum, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://oyunlag-kindergarden.vercel.app'
      },
      credentials: 'include',
      mode: 'cors'
    });

    if (response.ok) {
      const responseData = await response.json();
      if (responseData.content) {
        if (responseData.content.qPay_QRimage) {
          setQR(responseData.content.qPay_QRimage);
        } else {
          toast.error(responseData.content.name);
        }
      } else {
        toast.error('QPAY-дээр алдаа гарлаа');
      }
    } else {
      toast.error('Error: HTTP status code ' + response.status);
    }
  }


  function clearData() {
    setRegNum("");
    setQR("");
  }

    return (
      <div className={styles.login_box + ' p-3'}>
        {/* <h1 className="display-6 mb-3">Төлбөр төлөлт</h1> */}
        <Formik
          initialValues={{
            regNum: regNum,
          }}

          onSubmit={async (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
            try {
              await fetchQr();
            } catch (error) {
              toast.error("error: " + error);
            }
            setSubmitting(false);
          }} 

        >
          <Form>
            <ToastContainer />
            <div className="mb-3">
              <Field className="form-control" id="regNum" name="regNum"  value={regNum} onChange={(e : React.ChangeEvent<HTMLInputElement>) => setRegNum(e.target.value)} placeholder="Регистерийн дугаар" aria-describedby="usernameHelp" required />
              <ErrorMessage className={styles.error} name="regNum" component="div" />
            </div> 
            <div className={styles.login_button}>
              <button onClick={clearData} className="btn btn-secondary">Цэвэрлэх</button>
              <button type="submit" className="btn btn-primary">Төлбөр төлөх</button>
            </div>
            {qr ?
              <img src={`data:image/png;base64,${qr}`}/> : <div></div>
            }
          </Form>
        </Formik>
      </div>
    );
  };
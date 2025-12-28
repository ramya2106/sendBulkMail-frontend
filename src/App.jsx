import {useState} from 'react';
import axios from 'axios';
import './App.css'
import * as XLSX from 'xlsx';
function App() {
  const [emails,setEmails] =useState([]);
  const [subject, setSubject] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload=(evt)=>{
      const wb = XLSX.read(evt.target.result,{type:"array"});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws,{header:"A"});
      const mails = data.map(row => row.C).filter(Boolean);
      setEmails(mails);
    }
    reader.readAsArrayBuffer(file);
  }
  const sendMail = async() =>{
    setSending(true);
    try{
      const res = await axios.post(
        import.meta.env.VITE_API_URL+"/sendmail",
        {subject,msg,emaildata:emails}
      );
      alert(`Sent to ${res.data.count} emails`);
    } catch {
      alert('Failed');
    } finally {
      setSending(false);
    }
  }
  return(
    <div class="app-container">
      <h2>BULK MAIL SENDER</h2>
      <input type="text" placeholder="subject" onChange={e=>setSubject(e.target.value)}/>
      <textarea placeholder="Message" onChange={e => setMsg(e.target.value)}></textarea>

      <input type="file" onChange={handleFile}/>
      <p>{emails.length} emails loaded</p>
      <button onClick={sendMail} disable={sending}>{sending ? 'Sending...' : "Send Mail"}</button>
    </div>
  )
}

export default App

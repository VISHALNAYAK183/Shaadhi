



async function matching(type) {
  let mt;
  const data = {
    "matri_id": localStorage.getItem('matriId'),
    "matri_id_to": localStorage.getItem('matriIdTo'),
    "type": type
  };

 //consolelog('Request Data:', data);

  try {
    const response = await axios.post('${BASE_URL}/master_count.php', data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

   //consolelog('Success:', response.data);

    if (response.data.message.p_out_mssg_flg === 'Y') {
     //consolelog('Message:', response.data.message.p_out_mssg);

     //consolelog("Viewed this account:", response.data.$type_count[0].used_count);
      if (response.data.$type_count[0].used_count == 1) {
        mt = 'true';
      } else {
        mt = 'false';
      }
    } else {
     //consolelog('Message flag is not "Y". No further processing.');
    }
  } catch (error) {
   console.error('Error:', error);
    mt = 'false'; // Default value in case of an error
  }

  return mt;
}


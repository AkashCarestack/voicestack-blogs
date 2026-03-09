var myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`);
myHeaders.append("Content-Type", "application/json");

var requestOptionsGET = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Process a POST request
    } else {
      // const email = decodeURIComponent(req.query.email);
      const email = req.query.email;

      if (!email) {
        return res.status(400).send({ error: 'Email is required' });
      }

      // Helper function to retry finding contact (HubSpot might still be creating it)
      const findContactWithRetry = async (retries = 3, delay = 2000) => {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`, requestOptionsGET);
            
            if (response.status === 200) {
              const data = await response.json();
              if (data && data.id) {
                return data;
              }
            }
            
            // If not found and we have retries left, wait and try again
            if (i < retries - 1) {
              console.log(`Contact not found, retrying in ${delay}ms... (attempt ${i + 1}/${retries})`);
              await new Promise(resolve => setTimeout(resolve, delay));
            }
          } catch (err) {
            console.error(`Error finding contact (attempt ${i + 1}):`, err);
            if (i === retries - 1) throw err;
          }
        }
        return null;
      };

      try{
          const data = await findContactWithRetry();
          
          if (!data || !data.id) {
            console.error('Contact not found after retries:', email);
            return res.status(404).send({ 
              error: 'Contact not found in HubSpot',
              email: email,
              message: 'The contact may not have been created yet. UTM parameters will be captured on next interaction.'
            });
          }

          var raw = JSON.stringify({
              "properties": {
                  "leadsource": req.query.lead_source === 'branding' ? "Website" : (req.query.lead_source || "Website"),
                  "utm_term":req.query.term || "",
                  "utm_medium":req.query.medium || "",
                  "utm_campaign":req.query.campaign || "",
                  "utm_source":req.query.source || ""
              }
          });

          if(req.query.lead_source == "deploy_marketing"){
            raw = JSON.stringify({
              "properties": {
                  "leadsource": "Deploy Marketing",
                  "utm_term":req.query.term || "",
                  "utm_medium":req.query.medium || "",
                  "utm_campaign":req.query.campaign || "",
                  "utm_source":req.query.source || ""
              }
          });
          }

          console.log('Updating contact with UTM params:', JSON.parse(raw).properties);

          var requestOptionsPOST = {
              method: 'PATCH',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
          };

          const response2 = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${data.id}`, requestOptionsPOST)
          const finalData = await response2.json()
          
          if (response2.status === 200) {
            console.log('Successfully updated contact with UTM params');
            res.status(200).send({ finalData, success: true })
          } else {
            console.error('Failed to update contact:', finalData);
            res.status(response2.status).send({ finalData, success: false })
          }
      }

      catch(err){
          console.error('API Error:', err);
          res.status(500).send({error: err.message || err})
      }
        // Handle any other HTTP method
    }
}
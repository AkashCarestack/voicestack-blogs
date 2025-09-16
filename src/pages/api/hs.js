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

      

        try{
          const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`, requestOptionsGET)
          const data = await response.json();

          

          var raw = JSON.stringify({
              "properties": {
                  "leadsource": req.query.lead_source || "Website",
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

          


          var requestOptionsPOST = {
              method: 'PATCH',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
          };

          const response2 = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${data.id}`, requestOptionsPOST)
          const finalData = await response2.json()
          res.send({ finalData })
      }

      catch(err){
          res.send({err})
      }
        // Handle any other HTTP method
    }
}
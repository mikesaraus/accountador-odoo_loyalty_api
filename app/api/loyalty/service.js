const _ = process.env,
  { pg_client, pg_pool } = require('../../config').database

module.exports = {
  service_view:  (data, callBack) => {
    try {
      // Query the ir_property table of the barcodes
      let pg_query = `
        SELECT * FROM ir_property
        WHERE value_text='${data.card_id}'
        ORDER BY id DESC LIMIT 1
        `;
        pg_client.query(pg_query, async (error, ir_property_results) => {
        if (error) { return callBack(error) }
          
        const ir_property = ir_property_results?.rows?.[0]
        let jsonOutput = {
          ir_property: ir_property
        }
        if (ir_property?.res_id) {

          let partner_id = parseInt(ir_property.res_id.replaceAll('res.partner,',''))

          const loyaltyCardQuery = `
            SELECT * FROM loyalty_card 
            WHERE partner_id = $1 
            ORDER BY id DESC 
            LIMIT 1;
          `;
          const loyaltyCardResults = await pg_pool.query(loyaltyCardQuery, [partner_id]);

          const resPartnerQuery = `
            SELECT * FROM res_partner 
            WHERE id = $1 
            ORDER BY id DESC 
            LIMIT 1;
          `;
          const resPartnerResults = await pg_pool.query(resPartnerQuery, [partner_id]);

          // Combine results and send response
          jsonOutput = {
            ...jsonOutput,
            loyal_points: loyaltyCardResults?.rows?.[0]?.points,
            loyalty_card: loyaltyCardResults?.rows?.[0],
            res_partner: resPartnerResults?.rows?.[0]
          };
        };

        return callBack(null, jsonOutput)
      })
    } catch (error) {
       return callBack(error)
    }
  },
}

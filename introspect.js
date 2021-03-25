require("dotenv").config();
const fs = require("fs");
const fetch = require("node-fetch");
const {
  getIntrospectionQuery,
  printSchema,
  buildClientSchema,
} = require("graphql");

const shop = process.env.SHOP_HANDLE;
const apiVersion = process.env.API_VERSION;
const apiKey = process.env.API_KEY;

const main = async () => {
  const introspectionQuery = getIntrospectionQuery();

  const response = await fetch(
    `https://${shop}.myshopify.com/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": apiKey,
      },
      body: JSON.stringify({ query: introspectionQuery }),
    }
  );

  const { data } = await response.json();

  const schema = buildClientSchema(data);

  const schemaPrinted = printSchema(schema);

  fs.writeFileSync(`${apiVersion}.gql`, schemaPrinted);
};

main();

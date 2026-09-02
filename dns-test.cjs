const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

dns.promises
  .resolveSrv("_mongodb._tcp.cluster0.9egvqpg.mongodb.net")
  .then((records) => {
    console.log("MongoDB SRV records:");
    console.log(records);
  })
  .catch((error) => {
    console.error("DNS error:", error);
  });
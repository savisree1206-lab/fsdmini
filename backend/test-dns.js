const mongoose = require('mongoose');

// require('dns').setServers(['8.8.8.8', '1.1.1.1']); // REMOVED

mongoose.connect('mongodb://savithasreesenthilkumar_db_user:savithasree123@ac-ony8bp1-shard-00-00.gecazmr.mongodb.net:27017,ac-ony8bp1-shard-00-01.gecazmr.mongodb.net:27017,ac-ony8bp1-shard-00-02.gecazmr.mongodb.net:27017/?authSource=admin&replicaSet=atlas-aq2i5u-shard-0&tls=true')
  .then(() => {
    console.log('✅ Connected without custom DNS');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection error:', err);
    process.exit(1);
  });

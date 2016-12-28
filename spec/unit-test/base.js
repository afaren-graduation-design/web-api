import mongoose from 'mongoose';
import yamlConfig from 'node-yaml-config';
import path from 'path';

mongoose.Promise = global.Promise;

const config = yamlConfig.load(path.join(__dirname, '../../config/config.yml'));

before(()=> {
  mongoose.connect(config.database);
});
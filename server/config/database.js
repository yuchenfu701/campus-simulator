const mongoose = require('mongoose');

// MongoDB连接配置
const connectDB = async () => {
  try {
    // 默认连接本地MongoDB，如果MongoDB Compass已配置，会自动连接
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus_simulator';
    
    // 移除已弃用的选项（MongoDB Driver 4.0+ 不再需要）
    await mongoose.connect(mongoURI);
    
    console.log('✅ MongoDB连接成功');
    console.log(`📊 数据库: ${mongoose.connection.name}`);
    console.log(`🔗 连接地址: ${mongoURI}`);
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error.message);
    console.log('💡 提示: 请确保MongoDB Compass已启动，或检查连接字符串');
    process.exit(1);
  }
};

module.exports = connectDB;



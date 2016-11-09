/**
 * Created by zhangpei on 16/11/9.
 */
const getUrl = (req,res,next)=>{
    console.log(req.url);
    next();
};
module.exports =  getUrl
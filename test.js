// const query = require('./query2')

// const get_test_result = () => {
//     var output = [false];
//     return new Promise(function(resolve, reject) {
//       query.create_competitor('alice','white','alice1@email.com', 'ithaca, NY', 1,true).then(value1 => {
//         query.get_all_competitors().then(value => 
//         {
//             console.log(value.length);
//         for (var i=value.length-1; i>0; i--){
//             var obj = value[i];
//             if (obj.firstname == 'alice' && obj.lastname == 'white'){
//                 console.log("same");
//                 output = [true];
//                 break;
//             }else{
//                 output = [false];
//             }
//          }
//         });
//       })      
//       resolve(output);
//   });
// }

// module.exports = {
//     get_test_result
// }



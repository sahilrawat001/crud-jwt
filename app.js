
const http = require("http");
const fs = require("fs");
const jwt = require("jsonwebtoken");
 let secret = "1XAIX69DXLFND[P823";

let data = fs.readFileSync("db.json", "utf-8")

http.createServer(
    function (req, res) {
        res.writeHead(202, { 'Content-type': 'text/html' });

        console.log(req.url);
 

        if (req.url == "/signup") {
            let pData = JSON.parse(data);
            console.log(pData);

            let dt = "";
            req.on('data', (d) => {
                dt += d;

            })

            req.on('end', (d) => {

                // changing to object 
                dt = JSON.parse(dt);
                console.log(dt.mail, "****");
                let dmail = dt.mail;
                let checkmail = pData.some((i) => {
                    //    console.log(i.mail, dmail);
                    return i.mail == dmail;
                })
                console.log(checkmail);

                if (!checkmail) {


                    let nIndex = 0;
                    pData.forEach((i) => {
                        if (nIndex < i.id) {
                            nIndex = i.id;
                        }

                    });
                    //    console.log(newIndex,"fff");
                    dt.id = nIndex + 1;
                    console.log(dt);
                    pData.push(dt);
                    //   console.log(pData);

                    pData = JSON.stringify(pData);
                    let token = jwt.sign(dt, secret);
                    fs.writeFile("db.json", pData, "utf-8", function (err) {
                        console.log('added sucessfully');
                    })
                    res.end(JSON.stringify({ token: token }));
                 }

                else {
                    console.log("already present");
                    res.end("already present");

                }
                res.end();
            })


        }

        if (req.url == "/signin") {
 
            let pData = JSON.parse(data);

            //data from json api input
            let dt = "";
            req.on('data', (d) => {
                dt += d;

            })

            req.on('end', (d) => {

                // changing to object 
                dt = JSON.parse(dt);
                console.log(dt.mail, "----");
                let dmail = dt.mail;
                let dpass = dt.password;
                let checkmail = pData.some((i) => {
                    //  console.log(i.mail, dmail); 
                    return i.mail == dmail;
                })
                let checkpass = pData.some((i) => {
                    //  console.log(i.password, dpass); 
                    return i.password == dpass;
                })
                console.log(checkmail, "----");
                let auth = checkpass && checkmail;

                // adding id for new index
                if (!auth) {
                    return res.end(JSON.stringify({ status: false, msg: 'Auth is required' }))
                }

                else {
                    let rdata = pData.filter((i) => {
                        return i.mail == dmail;
                    })
                     console.log(rdata);
                    rdata = JSON.stringify(rdata);
                    let token = jwt.sign(rdata, secret);

                     res.end(JSON.stringify({ token: token }));

                }

            })
         }



        if (req.url.includes("/gets")) {

             let pData = jwt.verify(req.headers.token, secret);
            console.log(pData);
            let reqId;
 
            res.end("pData");
        }




        // assign id & if id already exist then it will not work
        if (req.url.includes("/tassign")) {
            let pDatas = jwt.verify(req.headers.token, secret);
            console.log(pDatas.id);
            let pData = JSON.parse(data);
            console.log(req.url, "8888");





            let resData = pData.filter((i) => i.id != pDatas.id);
 
            let rr = pDatas.asign;
        
            let dt = "";
            req.on('data', (d) => {
                dt += d;

            })

            req.on('end', (d) => {

                dt = JSON.parse(dt);
                console.log(dt.role);

                //check roles of api and json data
                console.log(rr, "===");
                let ans = rr.includes(dt.id);
                if (dt.role == pDatas.role || ans) {
                    console.log("cant, assign");

                    res.end();
                }
                else {

                     console.log(rr, "------------------");
 

                    rr.push(dt.id);

                    console.log(rr, "=========");
                    console.log(pDatas);
      
                    resData.push(pDatas);
                    resData = JSON.stringify(resData);
                    fs.writeFile("db.json", resData, "utf-8", function (err) {
                        console.log('added assignable sucessfully');
                    })
                    res.end();
                }

            })
            res.end();
        }




        //   if(req.url=="/delete"){
        //     let pData = JSON.parse(data);
        //     console.log(pData[0].id);


        //     //getting  data from api
        //     let dt = "";
        //     req.on('data', (d) => {
        //         dt += d;
        //     })

        //     // data saved in dt
        //     req.on("end", (d) => {
        //         dt = JSON.parse(dt);
        //         console.log(dt.id);
        //         let resData = pData.filter((i) => i.id != dt.id);
        //         console.log(resData);
        //         resData = JSON.stringify(resData);
        //         fs.writeFile("db.json", resData, "utf-8", function (err) {
        //             console.log('added');
        //         })
        //     })
        //     res.end();
        //   }




        //update marks 
        if (req.url.includes("/put")) {
            let pDatas = jwt.verify(req.headers.token, secret);
            console.log(pDatas);

            let pData = JSON.parse(data);
            let reqId = pDatas.id;
           
            var assign = pDatas.asign;
            console.log(assign);
            let rr = pDatas.role;
            console.log(rr);


            //getting  data from api
            let dt = "";
            req.on('data', (d) => {
                dt += d;
            })
            req.on("end", (d) => {
                dt = JSON.parse(dt);
                 let checkId = assign.includes(dt.id);


                if (rr == "t" && checkId) {
                    let resData = pData.filter((i) => i.id != pDatas.id);
             
                    console.log(dt, "88");
                     pDatas.marks = dt.marks;
                     resData.push(pDatas);
                    console.log(resData);

                    resData = JSON.stringify(resData);
                     fs.writeFile("db.json", resData, "utf-8", function (err) {
                        console.log('added');
                    })
                    res.end("update successfuly");
                }
                else {

                    console.log('not updated');

                    res.end("not updated");
                }
            })

            res.end();

        }

        if (req.url.includes("upinfo")) {
            let pDatas = jwt.verify(req.headers.token, secret);
            let pData = JSON.parse(data);
 
            let dt = "";
            req.on('data', (d) => {
                dt += d;

            })

            req.on('end', (d) => {
                dt = JSON.parse(dt);
                console.log(dt.id);
                if (dt.id != pDatas.id) {
                    console.log(" can't update");
                    res.end("you can't update data");
                }
                else {
                     let reqData = pData.filter((i) => i.id != dt.id);
                    pDatas.name = dt.name;
                    pDatas.mail = dt.mail;
                    pDatas.password = dt.password;
       
                    console.log(pDatas);
                    reqData.push(pDatas);
                    reqData = JSON.stringify(reqData);
                    fs.writeFile("db.json", reqData, "utf-8", function (err) {
                        console.log('added assignable sucessfully');
                    });
                    res.end();
                }
            })
            res.end();

        }

    }).listen(5000, () => {
        console.log('Server started')
    }); 

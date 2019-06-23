var productManager=new Vue({el:"#product-manager",data:{productList:prod,types:tp,brands:br,name:"",type:"",brand:"",img:"/img/placeholder.png"},methods:{search(){var t="/Product/search?type="+this.type+"&brand="+this.brand+"&name="+this.name;jsonAjax(t,"GET","",function(t){productManager.productList=t},alertError)},typeSearch(t){this.name="",this.type=t;var e="/Product/search?type="+this.type+"&brand=&name=";jsonAjax(e,"GET","",function(t){productManager.productList=t},alertError)},edit(t){toggleOverlay("#product-detail-overlay"),-1==this.types.findIndex(e=>e.type==this.productList[t].type)&&(productDetail.tempoType=this.productList[t].type),-1==this.brands.findIndex(e=>e.brand==this.productList[t].brand)&&(productDetail.tempoBrand=this.productList[t].brand);var e={};Object.assign(e,this.productList[t]),productDetail.productDetail=e,productDetail.isEdit=!0},remove(t){Swal.fire({type:"warning",title:"Are you sure on removing this product?",showCancelButton:!0,cancelButtonColor:"#d9534f",cancelButtonText:"No",confirmButtonColor:"#5cb85c",confirmButtonText:"Yes"}).then(e=>{if(e.value){var r={id:this.productList[t].id,searchName:productManager.name,searchType:productManager.type,searchBrand:productManager.brand};jsonAjax("/Product/RemoveProduct","POST",JSON.stringify(r),function(t){if("Success"==t.Status)return SwalSuccess("Product is succesfully removed.",""),productManager.productList=t.Data,0;"Database Error"==t.Status&&SwalError("Database Error. Please contact administrator.","")},alertError)}})},addItem(){productDetail.isEdit=!1,toggleOverlay("#product-detail-overlay")},clear(){this.name="",this.type="",this.brand="",this.search()}},watch:{types:function(){productDetail.types=this.types,typesTable.setData(this.types),this.type=""},brands:function(){productDetail.brands=this.brands,brandsTable.setData(this.brands),this.brand=""}}}),productDetail=new Vue({el:"#product-detail",data:{productDetail:{id:"",name:"",type:"",brand:"",price:"",img:"/img/placeholder.png",imgDetail:"/img/placeholder.png",qty:""},error:{name:[],type:[],brand:[],price:[],img:[],imgDetail:[],qty:[]},types:productManager.types,brands:productManager.brands,imgStatus:"No file is selected",imgDetailStatus:"No file is selected",tempoType:"",tempoBrand:"",isEdit:!0},methods:{handleSubmit(t){var e=new FormData(t.target);e.append("searchName",productManager.name),e.append("searchType",productManager.type),e.append("searchBrand",productManager.brand),this.isEdit?formAjax("/Product/EditProduct","POST",e,this.editProductList,alertError):formAjax("/Product/AddProduct","POST",e,this.addProductList,alertError)},previewImg(t){var e=new FileReader;e.onload=function(t){$("#img").attr("src",t.target.result)},e.readAsDataURL(t.target.files[0]),this.imgStatus=t.target.files[0].name},previewImgDetail(t){var e=new FileReader;e.onload=function(t){$("#imgDetail").attr("src",t.target.result)},e.readAsDataURL(t.target.files[0]),this.imgDetailStatus=t.target.files[0].name},hide(){this.$refs.img.value="",this.$refs.imgDetail.value="",this.tempoBrand="",this.tempoType="",this.imgDetailStatus="No file is selected",this.imgStatus="No file is selected",this.productDetail={id:"",name:"",type:"",brand:"",price:"",img:"/img/placeholder.png",imgDetail:"/img/placeholder.png",qty:""},$("#img").attr("src","/img/placeholder.png"),$("#imgDetail").attr("src","/img/placeholder.png"),toggleOverlay("#product-detail-overlay"),this.emptyError()},addProductList(t){return"Success"==t.Status?(SwalSuccess("New product is successfully added.",""),productManager.productList=t.Data,this.emptyError(),this.hide(),0):"Validation Error"==t.Status?(this.error=t.Message,SwalError("Invalid detail. Please check error messages.",""),0):void("Database Error"==t.Status&&SwalError("Database Error. Please contact administrator.",""))},editProductList(t){return"Success"==t.Status?(SwalSuccess("Edit is successful.",""),productManager.productList=t.Data,this.emptyError(),this.hide(),0):"Validation Error"==t.Status?(this.error=t.Message,SwalError("Invalid detail. Please check error messages.",""),0):void("Database Error"==t.Status&&SwalError("Database Error. Please contact administrator.",""))},emptyError(){this.error={name:[],type:[],brand:[],price:[],img:[],imgDetail:[],qty:[]}}},watch:{productDetail:function(){this.productDetail.img=this.productDetail.img}}}),productSetting=new Vue({el:"#product-setting",data:{types:productManager.types,brands:productManager.brands,newType:"",newBrand:"",typeError:[],brandError:[]},methods:{addType(){var t={type:this.newType};jsonAjax("/Product/AddType","POST",JSON.stringify(t),this.manageType,alertError)},addBrand(){var t={brand:this.newBrand};jsonAjax("/Product/AddBrand","POST",JSON.stringify(t),this.manageBrand,alertError)},manageType(t){return"Success"==t.Status?(productManager.types=t.Data,this.typeError=[],SwalSuccess("New type is successfully added.",""),0):"Validation Error"==t.Status?(SwalError("Invalid detail. Please check error messages.",""),this.typeError=t.Message,0):void("Database Error"==t.Status&&SwalError("Database Error. Please contact administrator.",""))},manageBrand(t){return"Success"==t.Status?(productManager.brands=t.Data,this.brandError=[],SwalSuccess("New brand is successfully added."),0):"Validation Error"==t.Status?(SwalError("Invalid detail. Please check error messages.",""),this.brandError=t.Message,0):void("Database Error"==t.Status&&SwalError("Database Error. Please contact administrator.",""))},hide(){this.newType="",this.newBrand="",this.typeError=[],this.brandError=[],toggleOverlay("#product-setting-overlay")},clearType(){this.typeError=[],this.newType=""},clearBrand(){this.brandError=[],this.newBrand=""}}}),deleteIcon=function(t,e,r){return'<i class="fas fa-times" style="color:red;"></i>'},typesTable=new Tabulator("#typesTable",{layout:"fitColumns",headerFilterPlaceholder:"Search",data:productManager.types,columns:[{title:"ID",field:"id",visible:!1},{title:"Type",field:"type",headerFilter:!0,widthGrow:3},{title:"Remove",formatter:deleteIcon,widthGrow:2,align:"center",tooltip:"Remove",cellClick(t,e){Swal.fire({type:"warning",title:"Are you sure on removing this?",text:"Type: "+e.getData().type,showCancelButton:!0,cancelButtonColor:"#d9534f",cancelButtonText:"No",confirmButtonColor:"#5cb85c",confirmButtonText:"Yes"}).then(t=>{t.value&&jsonAjax("/Product/DeleteType","POST",JSON.stringify({id:e.getData().id}),function(t){if("Success"==t.Status)return SwalSuccess("Type is successfully removed",""),productManager.types=t.Data,0;"Database Error"==t.Status&&SwalError("Database Error. Please contact administrator.","")},alertError)})}}]}),brandsTable=new Tabulator("#brandsTable",{layout:"fitColumns",headerFilterPlaceholder:"Search",data:productManager.brands,columns:[{title:"ID",field:"id",visible:!1},{title:"Brand",field:"brand",headerFilter:!0,widthGrow:3},{title:"Remove",formatter:deleteIcon,widthGrow:2,align:"center",tooltip:"Remove",cellClick(t,e){Swal.fire({type:"warning",title:"Are you sure on removing this?",text:"Brand: "+e.getData().brand,showCancelButton:!0,cancelButtonColor:"#d9534f",cancelButtonText:"No",confirmButtonColor:"#5cb85c",confirmButtonText:"Yes"}).then(t=>{t.value&&jsonAjax("/Product/DeleteBrand","POST",JSON.stringify({id:e.getData().id}),function(t){if("Success"==t.Status)return SwalSuccess("Brand is successfully removed",""),productManager.brands=t.Data,0;"Database Error"==t.Status&&SwalError("Database Error. Please contact administrator.","")},alertError)})}}]});

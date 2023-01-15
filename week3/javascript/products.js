
// 使用 ES module 引入 Vue 3 cdn 
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

// 引入 utils.js 的 swalMassage
import { swalMassage } from './utils.js';

// 引入 api.js 的 login api
import {
    apiCheckLogin,
    apiAdminGetProducts,
    apiAdminAddProduct,
    apiAdminRemoveProduct,
    apiAdminUpdateProduct,
    apiLogout
} from './api.js';




// bootstrap modal 實體化
// 套用 modal 方法
let productModal = null;
let delProductModal = null;



// Vue 起手式架構
createApp({
    // 資料(函式)
    data() {
        return {
            // 產品資料格式
            products: [],
            // 儲存單一產品
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
        }
    },
    // 生命週期(函式)
    // 外部傳入的資料要在 created() 後才能寫入到 data 內
    mounted() {
        // 進入產品頁時，先發送檢查是否登入 API 驗證
        this.checkLogin();

        // 等待元件完成生成後再來取得 modal DOM 元素，並實體化 modal
        productModal = new bootstrap.Modal(document.querySelector('#productModal'), {
            keyboard: false
        });

        delProductModal = new bootstrap.Modal(document.querySelector('#delProductModal'), {
            keyboard: false
        });
    },
    // 資料處理方法(物件)
    methods: {
        // 確認是否登入
        checkLogin() {
            apiCheckLogin()
                .then(res => {
                    console.log('確認登入!!');
                    // 確認有登入權限後，發送取得全部產品列表 api
                    this.getProdcuts();
                })
                .catch(err => {
                    swalMassage(`${err.response.data.message}`, 'error', 600);
                    setTimeout(() => {
                        window.location = 'login.html';
                    }, 1000);
                })
        },
        // 登出 (錯誤 400)
        logout() {
            apiLogout()
                .then(res => {
                    swalMassage(`${res.data.message}`, 'success', 600);
                    setTimeout(() => {
                        window.location = 'login.html';
                    }, 1000);
                })
                .catch(err => {
                    console.log(err.response);
                })
        },
        // 取得所有產品列表
        getProdcuts() {
            apiAdminGetProducts()
                .then(res => {
                    const { products } = res.data;
                    this.products = products;
                })
                .catch(err => {
                    console.log(err.response);
                })
        },
        // 打開 modal
        openModal(isNew, item) {
            if (isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: []
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === 'edit') {
                this.tempProduct = { ...item }
                this.isNew = false;
                productModal.show();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...item }
                delProductModal.show();
            }
        },
        // 刪除單一產品
        deleteProduct() {
            apiAdminRemoveProduct(this.tempProduct.id)
                .then(res => {
                    swalMassage(`${this.tempProduct.title} 已刪除成功 `, 'success', 600)
                    delProductModal.hide();
                    this.getProdcuts();
                })
                .catch(err => {
                    console.log(err.response);
                })
        },
        // 新增單一產品
        addProduct() {
            apiAdminAddProduct({ data: this.tempProduct })
                .then(res => {
                    swalMassage(res.data.message, 'success', 600);
                    productModal.hide()
                    this.getProdcuts();
                })
                .catch(err => {
                    console.log(err.response);
                })
        },
        // 編輯單一產品
        updateProduct() {
            apiAdminUpdateProduct(this.tempProduct.id, { data: this.tempProduct })
                .then(res => {
                    swalMassage(res.data.message, 'success', 600);
                    productModal.hide()
                    this.getProdcuts();
                })
                .catch(err => {
                    console.log(err.response);
                })
        },
        //  更新產品(新增或編輯)
        confirmEdit() {
            // 如果為 true 就是新增, false 為 編輯
            this.isNew ? this.addProduct() : this.updateProduct();
        },
        // 新增圖片
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        },
    },

}).mount('#app')


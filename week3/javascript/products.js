
// 使用 ES module 引入 Vue 3 cdn 
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

// 引入 utils.js 的 swalMassage
import { swalMassage } from './utils.js';

// 引入 api.js 的 login api
import {
    apiCheckLogin,
    apiAdminGetProducts,
    apiAdminRemoveProduct,
    apiLogout
} from './api.js';




// bootstrap modal 實體化
// 套用 modal 方法
let productModal = '';



// Vue 起手式架構
createApp({
    // 資料(函式)
    data() {
        return {
            // 產品資料格式
            products: [],
            // 儲存單一產品
            tempProduct: {},
        }
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
                    console.log(res);
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
        // 查看單一產品細節
        viewProduct(product) {
            this.openProductModal();
            // 避免物件參考特性傳入的 product 要使用拷貝方式賦予到 temp 物件
            this.tempProduct = { ...product };
        },
        // 刪除單一產品
        deleteProduct(product) {
            Swal.fire({
                title: `確定要刪除產品 ${product.title} 嗎?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '確定',
                cancelButtonText: '取消',
            }).then((result) => {
                if (result.isConfirmed) {
                    swalMassage(`產品  ${product.title} 已成功刪除`, 'success', 500);
                    apiAdminRemoveProduct(product.id)
                        .then(res => {
                            console.log(res);
                            this.getProdcuts();
                        })
                        .catch(err => {
                            console.log(err.response);
                        })
                }
            });
            // 刪除後產品後，把 temp 清空
            // 避免刪除產品後，單一產品還會顯示資訊
            this.tempProduct = {};
        },
        // 點擊小圖換大圖
        changeImage(img) {
            this.tempProduct.imageUrl = img;
        },
        // 打開 modal
        openProductModal() {
            productModal.show();
        },
        // 關閉 modal
        closeProductModal() {
            productModal.hide();
        },
    },
    // 生命週期(函式)
    // 外部傳入的資料要在 created() 後才能寫入到 data 內
    mounted() {
        // 進入產品頁時，先發送檢查是否登入 API 驗證
        this.checkLogin();

        // 等待元件完成生成後再來取得 modal DOM 元素，並實體化 modal
        productModal = new bootstrap.Modal(document.querySelector('#modal'));
    }
}).mount('#app')


import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";

// apiPath
const apiPath = "veganfoodtw2";
const BASE_URL = "https://vue3-course-api.hexschool.io/v2";



// 登入後台使用
// 帳號: pi20120413@yahoo.com.tw
// 密碼: jim771014



// 前台使用者
// const userRequest = axios.create({
//     baseURL: `${BASE_URL}/${apiPath}`,
//     // heders 的  'Content-Type': 'application/json', 一定要附上嗎??

//     // headers: {
//     //     'Content-Type': 'application/json',
//     // }
// });



// 後台管理者
const adminRequest = axios.create({
    baseURL: `${BASE_URL}`,
    // headers: {
    //     'Content-Type': 'application/json',
    // }
});



// // 測試有登入後 將 token 取出來，在所有的headers ['Authorization'] 加入 token
adminRequest.interceptors.request.use(
    (config) => {
        // 取出存在瀏覽器的 cookie 內的 vegnaToken
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)vegenToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        // 如果 token 存在的話，則帶入到 headers 當中
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (err) => Promise.reject(err),
);


// 前台
// 產品 API
// 取得所有產品
export const apiGetProducts = () => userRequest.get('/products/all');

// 篩選產品分類
export const apiFilterProducts = (categoryStr) => userRequest.get(`/products?category=${categoryStr}`);


// // 購物車 API
// export const apiGetCarts = () => userRequest.get('/carts');
// export const apiDeleteAllCarts = () => userRequest.delete('/carts');
// export const apiAddCart = (data) => userRequest.post('/carts',data);
// export const apiUpdateCart = (data) => userRequest.patch('/carts',data);
// export const apiDeleteCart = (id) => userRequest.delete(`/carts/${id}`);
// export const apiAddOrder = (data) => userRequest.post('/orders',data);


// 後台
//  登入
export const apiLogin = (data) => adminRequest.post('/admin/signin', data);
// 登出
export const apiLogout = () => adminRequest.post('/logout');
// 確認是否登入
export const apiCheckLogin = () => adminRequest.post('/api/user/check');


// 產品
export const apiAdminGetProducts = () => adminRequest.get(`/api/${apiPath}/admin/products/all`);
export const apiAdminAddProduct = (data) => adminRequest.post(`/api/${apiPath}/admin/product`, data);
export const apiAdminRemoveProduct = (id) => adminRequest.delete(`/api/${apiPath}/admin/product/${id}`);


// 檔案上傳
export const apiAdminAddFile = (data) => adminRequest.post(`/api/${apiPath}/admin/upload`, data);


//  訂單 API
// export const apiGetOrders = () => adminRequest.get(`${apiPath}/admin/orders`);
// export const apiDeleteAllOrders = () => adminRequest.delete(`/orders`);
// export const apiDeleteOrder = (id) => adminRequest.delete(`/orders/${id}`);
// export const apiUpdateOrder  = (data) => adminRequest.put('/orders', data);

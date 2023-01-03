// 使用 ES module 引入 Vue 3 cdn 
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js';

// 引入 utils.js 的 swalMassage
import { swalMassage } from './utils.js';

// 引入 api.js 的 login api
import { apiLogin } from './api.js';



//   Vue 起手式
createApp({
    // 資料(函式)
    data() {
        return {
            user: {
                username: "",
                password: ""
            }
        }
    },
    //   方法(物件)
    methods: {
        login() {
            apiLogin(this.user)
                .then(res => {
                    const { token, expired } = res.data;
                    console.log(token, expired);
                    // 登入成功後，把 token 和 expired 存到瀏覽器的 cookie
                    // expired 要將時間厝使用 new Date 轉為時間格式
                    document.cookie = `vegenToken=${token}; expires=${new Date(expired)};`;
                    swalMassage('登入成功', 'success', 600);
                    setTimeout(() => {
                        window.location = 'products.html';
                    }, 1000);
                })
                .catch(err => {
                    swalMassage(`${err.response.data.message},請重新登入`,'error',600);
                })

            // 清空登入欄位
            this.user.username = "";
            this.user.password = "";
        }
    },
}).mount('#app');
import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import modal from "./modal.js";
let productModal = null;
let delProductModal = null;
createApp({
  // 會改動的值放ref內
  //要點擊才觸發的函式需寫入return
  // ref要存取值都用.value 但原本就是字串不用
  setup() {
    const apiUrl = "https://ec-course-api.hexschool.io/v2";
    const apiPath = "aca101139";

    const status = ref(false);
    const productList = ref([]);
    const tempProduct = ref({
      imagesUrl: [],
    });

    const checkLogin = () => {
      axios
        .post(`${apiUrl}/api/user/check`)
        .then(() => {
          getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "index.html";
        });
    };

    const getData = () => {
      axios
        .get(`${apiUrl}/api/${apiPath}/admin/products/all`)
        .then((res) => (productList.value = res.data.products))
        .catch((err) => alert(err.response.data.message));
    };

    const openModal = (arg, product) => {
      if (arg === "new") {
        tempProduct.value = {
          imagesUrl: [],
        };
        status.value = "new";
        productModal.show();
      } else if (arg === "edit") {
        tempProduct.value = { ...product };
        status.value = "edit";
        productModal.show();
      } else if (arg === "delete") {
        tempProduct.value = { ...product };
        delProductModal.show();
      }
    };
    onMounted(() => {
      productModal = new bootstrap.Modal(
        document.getElementById("productModal"),
        {
          keyboard: false,
        }
      );

      delProductModal = new bootstrap.Modal(
        document.getElementById("delProductModal"),
        {
          keyboard: false,
        }
      );
      // Retrieve Token
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)WillyToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common.Authorization = token;
      checkLogin();
    });

    return {
      productList,
      tempProduct,
      openModal,
      status,
      getData,
    };
  },
  components: {
    modal,
  },
}).mount("#app");

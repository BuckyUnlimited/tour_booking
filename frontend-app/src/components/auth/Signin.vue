<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-tabs">
        <a href="#" class="auth-tab active"> Sign in </a>
        <router-link :to="{ name: 'auth.signup' }" class="auth-tab">Sign Up</router-link>
      </div>
      <div class="auth-header">
        <h1>Back on the trail</h1>
        <p> Sign in to view your booked routes and trip notes. </p>
      </div>
      <form @submit.prevent="signIn">
        <div class="mb-3">
          <label class="form-label"> Email </label>
          <input type="email" v-model="user.email" class="form-control custom-input" placeholder="you@example.com"
            :class="{ 'is-invalid': !!userError.email }" />
          <div class="invalid-feedback">
            {{ userError.email }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label"> Password </label>
          <input type="password" v-model="user.password" class="form-control custom-input" placeholder="Your password"
            autocomplete :class="{ 'is-invalid': !!userError.password }">
          <div class="invalid-feedback">
            {{ userError.password }}
          </div>
        </div>
        <div class="login-options">
          <a href="#" class="forgot-link"> Forgot password? </a>
        </div>
        <button type="submit" class="btn signin-button"> Sign in </button>

        <div class="register-text">
          New to the trails?
          <router-link :to="{ name: 'auth.signup' }" class="text-center">Register a new membership</router-link>
        </div>
      </form>

    </div>

  </div>
</template>
<script setup>
import { useRouter } from "vue-router";
import { reactive } from "vue";
import { apiSignIn } from "@/functions/api/auth";
import { LoadingModal, MessageModal, CloseModal } from "@/functions/swal";
import { useUserStore } from "@/stores/user";
const router = useRouter();
const userStore = useUserStore();

const user = reactive({
  email: "",
  password: "",
});

const userError = reactive({
  email: "",
  password: "",
});

const defaultUser = JSON.parse(JSON.stringify(user));
const defaultUserError = JSON.parse(JSON.stringify(userError));

function resetAllState() {
  Object.assign(user, defaultUser);
  Object.assign(userError, defaultUserError);
}

async function signIn() {
  try {
    LoadingModal('Signing In...');
    const response = await apiSignIn(user);
    const { data } = response;
    userStore.setState(data.user);
    userStore.setSanctumToken(data.token);
    resetAllState();
    router.replace({ name: "dashboard" });
    return CloseModal();
  } catch (error) {
    const { response } = error;
    if (!response) {
      return MessageModal({ icon: "error", title: "Error", text: error.message });
    }
    const { status, data } = response;
    if (status === 422) {
      Object.keys(userError).forEach((key) => {
        userError[key] = data.errors[key]
          ? data.errors[key][0]
          : "";
      });
      return CloseModal();
    }
    return MessageModal({ icon: "error", title: "Error", text: data.message });
  }
}
</script>
<style scoped>
.auth-page {
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 30px;

  background: #f5f3ec;
}

.auth-card {
  width: 100%;
  max-width: 714px;

  background: #fffefa;

  border: 1px solid #d8d5ca;

  border-radius: 5px;

  padding: 58px 50px 68px;
}


/* Tabs */

.auth-tabs {
  width: 218px;
  height: 48px;

  display: flex;

  background: #ebe9e1;

  border-radius: 30px;

  padding: 4px;

  margin-bottom: 42px;
}

.auth-tab {
  width: 50%;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;

  color: #77746c;

  text-decoration: none;

  font-size: 16px;

  border-radius: 25px;
}

.auth-tab.active {
  background: #4e7057;

  color: white;

  font-weight: 600;
}


/* Header */

.auth-header {
  margin-bottom: 34px;
}

.auth-header h1 {
  margin: 0 0 8px;

  color: #111712;

  font-size: 31px;

  font-weight: 700;

  letter-spacing: -0.5px;
}

.auth-header p {
  margin: 0;

  color: #77746e;

  font-size: 17px;

  line-height: 1.5;
}


/* Label */

.form-label {
  display: block;

  margin-bottom: 7px;

  color: #151815;

  font-size: 16px;

  font-weight: 600;
}


/* Input */

.custom-input {
  height: 53px;

  background: #eeece5;

  border: 1px solid #d6d2c7;

  border-radius: 4px;

  padding: 0 16px;

  color: #20241f;

  font-size: 17px;
}

.custom-input::placeholder {
  color: #888d91;
}

.custom-input:focus {
  background: #f4f2ec;

  border-color: #4e7057;

  box-shadow: 0 0 0 2px rgba(78, 112, 87, 0.12);
}


/* Remember / Forgot */

.login-options {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin: 19px 4px 31px;
}

.remember-box {
  display: flex;

  align-items: center;

  gap: 11px;
}

.remember-box .form-check-input {
  width: 18px;
  height: 18px;

  margin: 0;

  border: 1px solid #777;

  border-radius: 3px;
}

.remember-box label {
  color: #77746e;

  font-size: 16px;

  cursor: pointer;
}

.forgot-link {
  color: #c85a20;

  font-size: 16px;

  font-weight: 500;

  text-decoration: none;
}

.forgot-link:hover {
  color: #9f4215;
}


/* Button */

.signin-button {
  width: 100%;

  height: 56px;

  border: none;

  border-radius: 4px;

  background: #34552f;

  color: white;

  font-size: 18px;

  font-weight: 600;
}

.signin-button:hover {
  background: #294727;

  color: white;
}


/* Register */

.register-text {
  margin-top: 26px;

  text-align: center;

  color: #77746e;

  font-size: 16px;
}

.register-text a {
  color: #c85a20;

  font-weight: 600;

  text-decoration: none;
}

.register-text a:hover {
  text-decoration: underline;
}


/* Responsive */

@media (max-width: 576px) {

  .auth-page {
    padding: 15px;
  }

  .auth-card {
    padding: 35px 25px 40px;
  }

  .auth-header h1 {
    font-size: 27px;
  }

  .auth-header p {
    font-size: 15px;
  }

  .login-options {
    gap: 15px;
  }

}
</style>

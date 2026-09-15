<template>
  <div class="auth-page">

    <div class="auth-card">

      <!-- Tabs -->
      <div class="auth-tabs">
        <router-link :to="{ name: 'auth.signin' }" class="auth-tab ">Sign In</router-link>
        <a href="#" class="auth-tab active">
          Sign Up
        </a>
      </div>

      <!-- Header -->
      <div class="auth-header">

        <h1>Start your journey</h1>

        <p>
          Create an account to booking and save your trip notes.
        </p>

      </div>
      <form @submit.prevent="signUp">
        <div class="mb-3">
          <label class="form-label">
            Name
          </label>
          <input type="text" v-model="user.name" class="form-control custom-input" placeholder="Your name"
            :class="{ 'is-invalid': !!userError.name }" />
          <div class="invalid-feedback">
            {{ userError.name }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">
            Email
          </label>
          <input type="email" v-model="user.email" class="form-control custom-input" placeholder="email@example.com"
            :class="{ 'is-invalid': !!userError.email }" />
          <div class="invalid-feedback">
            {{ userError.email }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">
            Password
          </label>
          <input type="password" v-model="user.password" autocomplete class="form-control custom-input"
            placeholder="Create a password" :class="{ 'is-invalid': !!userError.password }" />
          <div class="invalid-feedback">
            {{ userError.password }}
          </div>
        </div>
        <div class="mb-4">
          <label class="form-label">
            Confirm password
          </label>
          <input type="password" v-model="user.password_confirmation" class="form-control custom-input"
            placeholder="Confirm your password" autocomplete>
        </div>
        <button type="submit" class="btn signin-button">
          Create account
        </button>
        <div class="register-text">
          Already have an account?<router-link :to="{ name: 'auth.signin' }" class="text-center"> Sign In</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { reactive } from "vue";
import { apiSignUp } from "@/functions/api/auth";
import { LoadingModal, MessageModal, CloseModal } from "@/functions/swal";
const router = useRouter();

const user = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const userError = reactive({
  name: "",
  email: "",
  password: "",
});

const defaultUser = JSON.parse(JSON.stringify(user));
const defaultUserError = JSON.parse(JSON.stringify(userError));

function resetAllState() {
  Object.assign(user, defaultUser);
  Object.assign(userError, defaultUserError);
}

async function signUp() {
  try {
    LoadingModal('Signing Up...');
    await apiSignUp(user);
    resetAllState();
    return MessageModal({
      icon: "success",
      title: "Success",
      text: "Your account has been created successfully."
    },
      () => {
        router.replace({ name: "auth.signin" });
      });
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
  margin-bottom: 30px;
}

.auth-header h1 {
  margin: 0 0 8px;

  color: #111712;

  font-size: 31px;

  font-weight: 700;
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


/* Terms */

.terms-box {
  display: flex;

  align-items: center;

  gap: 10px;

  color: #77746e;

  font-size: 15px;
}

.terms-box .form-check-input {
  width: 18px;
  height: 18px;

  margin: 0;
}

.terms-box a {
  color: #c85a20;

  font-weight: 600;

  text-decoration: none;
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


/* Bottom */

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

}
</style>

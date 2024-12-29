<template>
  <v-app>
    <v-container class="d-flex align-center justify-center fill-height" style="height: 100vh; background-color: #f2f2f2"
    >
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="2" style="border-radius: 12px; overflow: hidden">
            <v-row no-gutters>
              <!-- Kolom Kiri: Image -->
              <v-col cols="12" md="6" class="d-flex justify-center align-center" style="background-color: #f4f8ff; padding: 12px"
              >
                <v-img src="@/assets/image.svg" max-width="250" max-height="250" contain alt="STIManage Logo"
                />
              </v-col>

              <!-- Kolom Kanan: Form Registration -->
              <v-col cols="12" md="6" class="px-8 py-6">
                <h2 class="text-h5 font-weight-bold text-center mb-4" style="margin-bottom: 16px; text-align: center;"
                >
                  Create Your Account
                </h2>

                <v-form @submit.prevent="handleRegister">
                  <!-- Username Field -->
                  <v-text-field v-model="form.username" label="Username" outlined dense class="mb-3" :error-messages="errors.username" @input="clearError('username')"
                  />

                  <!-- Password Field -->
                  <v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password" outlined dense class="mb-3 password-input" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="togglePasswordVisibility" :error-messages="errors.password" @input="clearError('password')" required
                  />

                  <!-- Confirm Password Field -->
                  <v-text-field v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'" label="Confirm Password" outlined dense class="mb-3" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="togglePasswordVisibility" :error-messages="errors.confirmPassword" @input="clearError('confirmPassword')" required
                  />

                  <!-- Submit Button -->
                  <v-btn type="submit" color="primary" block large>
                    Register
                  </v-btn>
                </v-form>

                <!-- Error Alert -->
                <v-alert v-if="errorMessage" type="error" dense class="mt-4"> {{ errorMessage }}
                </v-alert>

                <!-- Success Alert -->
                <v-alert v-if="successMessage" type="success" dense class="mt-4"> {{ successMessage }}
                </v-alert>

                <!-- Login Redirect -->
                <div class="text-center mt-4">
                  <p class="text-body-2">
                    Have an account?
                    <span class="clickable-text" @click="redirectToLogin">
                      Login here
                    </span>
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";

// Reactive State
const form = ref({ username: "", password: "", confirmPassword: "" });
const errors = ref({});
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);

// API Endpoint
const registrationEndpoint = "http://localhost:3000/api/v1/registration";

// Clear Error Message for a specific field
const clearError = (field) => {
  errors.value[field] = null;
};

// Toggle Password Visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Validation Logic
const validateForm = () => {
  errors.value = {};

  // Validasi Username
  if (!form.value.username) {
    errors.value.username = "Username wajib diisi";
  } else if (form.value.username.length < 8) {
    errors.value.username = "Username harus memiliki minimal 8 karakter";
  }

  // Validasi Password
  if (!form.value.password) {
    errors.value.password = "Password wajib diisi";
  } else {
    const passwordErrors = [];
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;

    // Cek panjang minimal 8 karakter
    if (form.value.password.length < 8) {
      passwordErrors.push("Password minimal harus terdiri dari 8 karakter");
    }

    // Cek setidaknya satu karakter spesial
    if (!specialCharRegex.test(form.value.password)) {
      passwordErrors.push("Password harus mengandung setidaknya satu karakter spesial");
    }

    // Cek setidaknya satu huruf besar
    if (!uppercaseRegex.test(form.value.password)) {
      passwordErrors.push("Password harus mengandung setidaknya satu huruf besar");
    }

    // Cek setidaknya satu huruf kecil
    if (!lowercaseRegex.test(form.value.password)) {
      passwordErrors.push("Password harus mengandung setidaknya satu huruf kecil");
    }

    // Gabungkan pesan error jika ada
    if (passwordErrors.length > 0) {
      errors.value.password = passwordErrors.join(". ");
    }
  }

  // Validate Confirm Password
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = "Konfirmasi password wajib diisi";
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = "Password tidak cocok";
  }

  return Object.keys(errors.value).length === 0;
};

// Handle Registration Process
const handleRegister = async () => {
  errorMessage.value = "";
  successMessage.value = "";

  // Validate Form before submission
  if (!validateForm()) return;

  try {
    // Make API Call for Registration
    const response = await fetch(registrationEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.value.username,
        password: form.value.password,
      }),
    });

    // Parse Response
    const data = await response.json();

    if (!response.ok) {
      if (data.errors && data.errors.toLowerCase().includes("username")) {
        throw new Error("Username telah terdaftar. Silakan gunakan username lain.");
      }
      throw new Error(data.errors || "Registrasi Gagal.");
    }


    // Handle Successful Registration
    successMessage.value = "Registrasi berhasil! Silakan login untuk melanjutkan.";
    errorMessage.value = "";
    setTimeout(() => router.push("/login"), 2000);
  } catch (error) {
    // Handle Error
    errorMessage.value = error.message || "Terjadi Error. Silakan coba lagi.";
    successMessage.value = "";
  }
};

const redirectToLogin = () => router.push("/login");
</script>

<style scoped>
html,
body,
.v-application {
  height: 100%;
  background-color: #f2f2f2 !important;
}

.clickable-text {
  color: #1976d2; /* Matches Vuetify primary color */
  cursor: pointer;
  text-decoration: underline;
}

.clickable-text:hover {
  text-decoration: none;
}
</style>

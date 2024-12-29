<template>
  <v-container fluid class="full-height px-10">
    <!-- Header Section -->
    <v-row class="justify-center align-center mt-5">
      <div class="d-flex bg-custom px-5 py-2" style="border-radius: 8px">
        <v-img src="@/assets/image.svg" alt="STImanage logo" style="width: 36px; height: 36px;margin-right: 8px"contain>
        </v-img>
        <h1 style="color: #2975a5; margin: 0; font-size: 24px">STImanage</h1>
      </div>

      <!-- Logout Button -->
      <v-btn color="red" outlined @click="logout" class="logout-btn">
        <v-icon left>mdi-logout</v-icon>
        Logout
      </v-btn>
    </v-row>

    <v-row align="center" class="py-8 align-content-end mt-5" justify="center">
      <!-- Summary Section -->
      <div class="d-flex flex-wrap"  style="gap: 10px; max-width: 100%;">
        <div class="text-center mr-3 ml-3 mb-2">
          <div class="d-flex align-center justify-center">
            <p class="mb-0 mr-3" style="color: white; font-weight: bold">
              Total Task
            </p>
            <span class="rounded-lg border font-weight-bold px-2 py-2 bg-white">{{ this.taskCounts.total_task }}</span>
          </div>
        </div>
        <div class="text-center mr-2 mb-2">
          <div class="d-flex align-center justify-center">
            <p class="mb-0 mr-3" style="color: white; font-weight: bold">
              Task To Do
            </p>
            <span class="rounded-lg border font-weight-bold px-2 py-2 bg-white">{{ this.taskCounts.task_todo }}</span>
          </div>
        </div>
        <div class="text-center mr-2 mb-2">
          <div class="d-flex align-center justify-center">
            <p class="mb-0 mr-3" style="color: white; font-weight: bold">
              Task Doing
            </p>
            <span class="rounded-lg border font-weight-bold px-2 py-2 bg-white">{{ this.taskCounts.task_doing }}</span>
          </div>
        </div>
        <div class="text-center mr-2 mb-2">
          <div class="d-flex align-center justify-center">
            <p class="mb-0 mr-3" style="color: white; font-weight: bold">
              Task Ready to QA
            </p>
            <span class="rounded-lg border font-weight-bold px-2 py-2 bg-white">{{ this.taskCounts.task_ready_to_qa }}</span>
          </div>
        </div>
        <div class="text-center mr-2 mb-2">
          <div class="d-flex align-center justify-center">
            <p class="mb-0 mr-3" style="color: white; font-weight: bold">
              Task Failed
            </p>
            <span class="rounded-lg border font-weight-bold px-2 py-2 bg-white">{{ this.taskCounts.task_failed }}</span>
          </div>
        </div>
        <div class="text-center mr-2 mb-2">
          <div class="d-flex align-center justify-center">
            <p class="mb-0 mr-3" style="color: white; font-weight: bold">
              Task Done
            </p>
            <span class="rounded-lg border font-weight-bold px-2 py-2 bg-white">{{ this.taskCounts.task_done }}</span>
          </div>
        </div>

        <!-- Buttons Section -->
        <div class="d-flex mb-2 px-3 py-1" style="gap: 10px">
          <v-btn color="green" outlined class="ml-2" @click="openFilterDialog">
            <v-icon left>mdi-filter-variant</v-icon>
            Filter
          </v-btn>
          <v-btn @click="openDialog()" color="orange" outlined >
            <v-icon left>mdi-plus</v-icon>
            Tambah
          </v-btn>
        </div>
      </div>
    </v-row>

    <!-- Data Table -->
    <v-data-table :items="filteredDataTable" :headers="headers" item-key="id" class="elevation-1 mb-1 rounded-lg">
      <template v-slot:item.actions="{ item }">
        <div class="d-flex gap-2 justify-center">
          <!-- Detail Button -->
          <v-btn color="info" outlined dense @click="handleDetail(item)" style="min-width: 40px; max-width: 40px; margin: 0px 2px 0px 4px">
            <v-icon left>mdi-eye</v-icon>
          </v-btn>

          <!-- Edit Button -->
          <v-btn color="orange" outlined dense @click="editTask(item)" style="min-width: 40px; max-width: 40px; margin: 0px 2px 0px 4px">
            <v-icon left>mdi-pencil</v-icon>
          </v-btn>

          <!-- Delete Button -->
          <v-btn color="red" outlined dense @click="deleteTask(item)" style="min-width: 40px; max-width: 40px; margin: 0px 2px 0px 4px">
            <v-icon left>mdi-delete</v-icon>
          </v-btn>
        </div>
      </template>
    </v-data-table>

    <!-- Add Task Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card class="bg-orange">
        <v-card-title class="orange white--text">
          <span class="text-h6">Tambah Task</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" @submit.prevent="handleSubmit">
            <!-- Input Fields -->
            <v-text-field class="bg-white form-input rounded-input" v-model="formData.task_name" label="Nama Task" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-text-field>
            <v-text-field class="bg-white form-input rounded-input" v-model="formData.gitlab_link" label="Link Gitlab" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-text-field>
            <v-select class="bg-white form-input rounded-input" v-model="formData.scope" :items="scopeOptions" label="Scope" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.module_type" :items="moduleOptions" label="Jenis Modul" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.problem_type" :items="issueOptions" label="Jenis Masalah" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.category" :items="categoryOptions" label="Kategori" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.programmer_name" :items="programmerOptions" label="Programmer" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.qa_name" :items="qaOptions" label="QCers" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <vue-datepicker class="bg-white form-input rounded-input" v-model="formData.deadline_date" :format="formatDate" placeholder="Tanggal Deadline" auto-apply  :monday-first="true" style="height: 60px; margin-bottom: 0; padding: 12px 2px 0px 2px">
            </vue-datepicker>
            <div v-if="isDatePickerEmpty" class="v-input__details" style="padding: 6px 16px 0px 16px; color: rgb(var(--v-theme-error));">
              <div class="v-messages" role="alert" aria-live="polite">
                <div class="v-messages__message">Kolom wajib diisi

                </div>
              </div><!---->
            </div>
          </v-form>
        </v-card-text>

        <!-- Modal Actions -->
        <v-card-actions>
          <v-btn color="white" text @click="closeAddDialog" class="pa-2 bg-grey">Batal</v-btn>
          <v-btn color="white" class="pa-2 bg-green" @click="handleSubmit()">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Task Dialog -->
    <v-dialog v-model="editDialog" max-width="600px">
      <v-card class="bg-orange">
        <v-card-title class="orange white--text">
          <span class="text-h6">Edit Task</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" @submit.prevent="handleUpdate">
            <!-- Input Fields -->
            <v-text-field class="bg-white form-input rounded-input" v-model="formData.task_name" label="Nama Task" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-text-field>
            <v-text-field class="bg-white form-input rounded-input" v-model="formData.gitlab_link" label="Link Gitlab" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-text-field>
            <v-select class="bg-white form-input rounded-input" v-model="formData.scope" :items="scopeOptions" label="Scope" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.module_type" :items="moduleOptions" label="Jenis Modul" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.problem_type" :items="issueOptions" label="Jenis Masalah" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.category" :items="categoryOptions" label="Kategori" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.programmer_name" :items="programmerOptions" label="Programmer" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <v-select class="bg-white form-input rounded-input" v-model="formData.qa_name" :items="qaOptions" label="QCers" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px">
            </v-select>
            <vue-datepicker class="bg-white form-input rounded-input "  v-model="formData.deadline_date" :format="formatDate" placeholder="Tanggal Deadline" auto-apply  :monday-first="true" style="height: 60px; padding: 12px 2px 0px 2px; margin-bottom:0px;">
            </vue-datepicker>
            <div v-if="isDatePickerEmpty" class="v-input__details" style="padding: 6px 16px 10px 16px; color: rgb(var(--v-theme-error));">
              <div class="v-messages" role="alert" aria-live="polite">
                <div class="v-messages__message">Kolom wajib diisi

                </div>
              </div><!---->
            </div>
            <v-select class="bg-white form-input rounded-input" :style="{ marginTop: isDatePickerEmpty ? '0px' : '30px' }"   v-model="formData.task_status" :items="statusOptions" label="Status Pekerjaan" outlined required :rules="[rules.required]" style="height: 60px; padding: 2.5px 2px 0px 2px; ">
            </v-select>
          </v-form>
        </v-card-text>

        <!-- Modal Actions -->
        <v-card-actions>
          <v-btn color="white" text @click="closeEditDialog()" class="pa-2 bg-grey">Batal</v-btn>
          <v-btn color="white" class="pa-2 bg-green" @click="confirmEditTask()">Simpan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Filter Dialog -->
    <v-dialog v-model="filterDialog" max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Filter Tasks Berdasarkan <br> Status Pekerjaan</span>
        </v-card-title>
        <v-card-text>
          <v-checkbox
            v-model="checkAll"
            label="Check All"
            @change="toggleCheckAll"
            hide-details
          ></v-checkbox>

          <v-divider class="my-3"></v-divider>

          <v-checkbox
            v-for="status in statusOptions"
            :key="status"
            v-model="selectedStatuses"
            :label="status"
            :value="status"
            hide-details
          ></v-checkbox>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" class="pa-2 bg-grey"  text @click="closeFilterDialog">Batal</v-btn>
          <v-btn color="white" class="pa-2 bg-green" text @click="applyFilter">Terapkan</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Task Detail Dialog -->
    <v-dialog v-model="dialogDetail" max-width="600px">
      <v-card>
        <v-card-title class="orange white--text">
          <span class="text-h6">Task Detail</span>
        </v-card-title>

        <v-card-text>
          <div v-if="taskDetail">
            <v-row>
              <v-col cols="12" sm="6">
                <div class="mb-3"><strong>Nama Task:<br /></strong>{{ taskDetail.task_name }}</div>
                <div class="mb-3"><strong>Link GitLab:<br /></strong>{{ taskDetail.gitlab_link }}</div>
                <div class="mb-3"><strong>Scope:<br /></strong>{{ taskDetail.scope }}</div>
                <div class="mb-3"><strong>Jenis Modul:<br /></strong>{{ taskDetail.module_type }}</div>
                <div class="mb-3"><strong>Jenis Masalah:<br /></strong>{{ taskDetail.problem_type }}</div>
                <div class="mb-3"><strong>Kategori:<br /></strong>{{ taskDetail.category }}</div>
                <div class="mb-3"><strong>Programmer:<br /></strong>{{ taskDetail.programmer_name }}</div>
                <div class="mb-3"><strong>QCers:<br /></strong>{{ taskDetail.qa_name }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="mb-3"><strong>Tanggal Open:<br /></strong>{{ taskDetail.open_date }}</div>
                <div class="mb-3"><strong>Tanggal Deadline:<br /></strong>{{ taskDetail.deadline_date }}</div>
                <div class="mb-3"><strong>Status Keterlambatan:<br /></strong>{{ taskDetail.deadline_status }}</div>
                <div class="mb-3"><strong>Status Pekerjaan:<br /></strong>{{ taskDetail.task_status }}</div>
                <div class="mb-3"><strong>Dibuat Oleh:<br /></strong>{{ taskDetail.created_by }}</div>
                <div class="mb-3"><strong>Terakhir Diperbarui:<br /></strong>{{ formatDate(taskDetail.status_log.updated_at) }}</div>
                <div class="mb-3"><strong>Terakhir Diperbarui Oleh:<br /></strong>{{ taskDetail.status_log.updated_by }}</div>
              </v-col>
            </v-row>
          </div>
        </v-card-text>

        <!-- Close Button -->
        <v-card-actions class="d-flex">
          <v-btn color="white" text @click="closeDialogDetail()" class="pa-2 bg-grey">Tutup</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <div>
      <!-- Confirmation Dialog for Delete -->
      <v-dialog v-model="deleteDialog.show" max-width="400px">
        <v-card>
          <v-card-title class="headline">Konfirmasi Hapus Task</v-card-title>
          <v-card-text>
            Yakin untuk Menghapus Task <strong>{{ deleteDialog.taskName }}</strong>?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" class="pa-2 bg-grey" text @click="deleteDialog.show = false">Batal</v-btn>
            <v-btn color="white" class="pa-2 bg-red" text @click="confirmDelete">Hapus</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


      <!-- Confirmation Dialog for Update -->
      <v-dialog v-model="confirmEditDialog" max-width="400px">
        <v-card>
          <v-card-title class="headline">Konfirmasi Edit Task</v-card-title>
          <v-card-text>
            Yakin untuk Mengedit Task
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="white" class="pa-2 bg-grey" text @click="closeConfirmEditDialog()">Batal</v-btn>
            <v-btn color="white" class="pa-2 bg-red" text @click="confirmedEditDialog()">Perbarui</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar for Success Messages -->
      <v-snackbar
        v-model="snackbar.show"
        :timeout="5000"
        max-width="400px"
        color="grey"
        class="d-flex flex-column align-center justify-center text-center"
      >
        <div class="d-flex flex-column align-center justify-center">
          <div class="mb-2 text-black">{{ snackbar.message }}</div>
          <v-btn color="white" class="text-black" text @click="snackbar.show = false">Tutup</v-btn>
        </div>
      </v-snackbar>
    </div>

    <!-- Export Button -->
    <div class="d-flex justify-end mr-0.5 py-4">
      <v-btn color="green" @click="exportData">
        <v-icon left>mdi-export</v-icon>
        Export
      </v-btn>
    </div>
  </v-container>
</template>


<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { reactive } from 'vue';

export default {
  components: {
    "vue-datepicker": VueDatePicker,
  },
  data() {
    return {
      statusOptions: ["To Do", "Doing", "Ready to QA", "Failed", "Done"],
      headers: [
        { title: "No", key: "index", align: "center" },
        { title: "Nama Task", key: "task_name" },
        { title: "Link GitLab", key: "gitlab_link", align: "center" },
        { title: "Scope", key: "scope" },
        { title: "Jenis Modul", key: "module_type" },
        { title: "Jenis Masalah", key: "problem_type" },
        { title: "Kategori", key: "category" },
        { title: "Programmer", key: "programmer_name" },
        { title: "QCers", key: "qa_name" },
        { title: "Tanggal Open", key: "open_date" },
        { title: "Tanggal Deadline", key: "deadline_date" },
        { title: "Status Pekerjaan", key: "task_status" },
        { title: "Status Keterlambatan", key: "deadline_status" },
        { title: "Aksi", key: "actions", align: "center" },
      ],
      tasks: [],
      isEdit: false,
      dataTable: [],
      taskCounts: reactive({
        total_task: 0,
        task_todo: 6,
        task_doing: 0,
        task_ready_to_qa: 0,
        task_failed: 0,
        task_done: 0
      }),
      dialog: false,
      dialogDetail: false,
      taskDetail: null,
      menu: false,
      detailDialog: false,
      selectedTask: {},
      formData: {
        task_name: "",
        gitlab_link: "",
        scope: "",
        module_type: "",
        problem_type: "",
        category: "",
        programmer_name: "",
        qa_name: "",
        deadline_date: "",
        task_status: "To Do",
      },
      errors: {
        deadline_date: "",
      },
      snackbar: {
        show: false,
        message: "",
      },
        deleteDialog: {
        show: false,
        taskId: null,
        taskName: "",
      },
      editDialog: false,
      isConfirmed: false,
      confirmEditDialog: false,
      isDatePickerEmpty: false,
      rules: {
        required: value => !!value || 'Kolom wajib diisi',
      },
      valid: false,
      scopeOptions: ["BE", "FE", "BE & FE"],
      moduleOptions: ["DTS User", "DTS Admin"],
      issueOptions: [
        "Pendaftaran Pelatihan",
        "Membuat Pelatihan",
        "Masalah Lainnya",
      ],
      categoryOptions: [
        "Fitur Baru",
        "Improvement",
        "Data",
        "Incident",
        "Bugs",
        "Issue",
      ],
      programmerOptions: ["Imam", "Fahmi"],
      qaOptions: ["Herlambang", "Alfi"],

      // Modal state
      filterDialog: false,
      filteredDataTable: [],
      selectedStatuses: [],
      checkAll: true,

    };
  },
  methods: {
    openDialog() {
      this.isDatePickerEmpty = false;
      this.resetForm();
      this.isEdit = false;
      this.dialog = true;
    },

    closeAddDialog() {
      this.dialog = false;
      this.isDatePickerEmpty = false;
      this.resetForm();
    },

    closeEditDialog() {
      this.editDialog = false;
      this.isDatePickerEmpty = false;
    },

    closeDialogDetail() {
      this.dialogDetail = false;
      this.taskDetail = null;
    },

    closeConfirmEditDialog(){
      this.confirmEditDialog = false;
    },

    confirmedEditDialog(){
      this.handleUpdate();
      this.confirmEditDialog = false;
      this.editDialog = false;
    },

    openFilterDialog() {
      this.filterDialog = true;

    },

    closeFilterDialog() {
      this.filterDialog = false;
    },

    editTask(task) {
      this.selectedTask = task;
      this.formData = {
        ...task,
      };
      this.isEdit = true;
      this.editDialog = true;
    },

      // Method to open the confirmation dialog
    deleteTask(task) {
      this.deleteDialog.taskId = task.id;
      this.deleteDialog.taskName = task.task_name;
      this.deleteDialog.show = true;
    },

    async confirmEditTask(){
      this.snackbar.show = false;
      const res = await this.$refs.form.validate();
      const dateError = await this.validateDate();

      if (!res.valid || dateError) {
        this.snackbar.message = "Form tidak valid. Silakan periksa kembali.";
        this.snackbar.show = true;
        return
      };

      this.confirmEditDialog= true;
    },

    // Method to confirm and proceed with deletion
    confirmDelete() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$router.push("/login");
        return;
      }

      fetch(`http://localhost:3000/api/v1/task/${this.deleteDialog.taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.errors || "Gagal untuk Mengapus Task.");
            });
          }

          // Show success snackbar
          this.snackbar.message = "Task Berhasil dihapus!";
          this.snackbar.show = true;
          this.deleteDialog.show = false;
          this.getAllTasks();
          this.getSummary();
        })
        .catch((error) => {
          this.snackbar.message = error.message || "Terjadi Error saat Menghapus Task.";
          this.snackbar.show = true;
          this.deleteDialog.show = false;
        });
    },

    async validateDate() {
      // if it is null or empty setting to true
      if (!this.formData.deadline_date) {
        this.isDatePickerEmpty = true;
        return true;
      } else {
        this.isDatePickerEmpty = false;
        return false;
      }
    },

    formatDate(date) {
      if (!date) return "";

      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (datePattern.test(date)) {
        return date;
      }

      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    async getAllTasks() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kamu perlu login untuk menjalankan aksi ini.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/v1/tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors || "Gagal Fetch Tasks.");
        }

        const result = await response.json();

        // Assuming the response contains a `tasks` array
        this.dataTable = result.data.map((task, index) => ({
          ...task,
          index: index + 1,
        }));

        // Initialize the filtered data with all tasks
        this.filteredDataTable = [...this.dataTable];
      } catch (error) {
        // console.error("Gagal Fetch Tasks:", error.message);
        // alert(error.message || "Terjadi Sebuah Error. Coba lagi!.");
        this.snackbar.message = error.message || "Terjadi Sebuah Error. Coba lagi!.";
        this.snackbar.show = true;
      }
    },

    async getSummary() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kamu perlu login untuk menjalankan aksi ini.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/v1/tasks/summary", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors || "Gagal Fetch Tasks.");
        }

        const result = await response.json();
        this.taskCounts.total_task = result.data.total_task;
        this.taskCounts.task_todo = result.data.task_todo;
        this.taskCounts.task_doing = result.data.task_doing;
        this.taskCounts.task_ready_to_qa = result.data.task_ready_to_qa;
        this.taskCounts.task_failed = result.data.task_failed;
        this.taskCounts.task_done = result.data.task_done;

      } catch (error) {
        // console.error("Error fetching tasks:", error.message);
        // alert(error.message || "An error occurred. Please try again.");
        this.snackbar.message = error.message || "Terjadi Sebuah Error. Coba lagi!.";
        this.snackbar.show = true;
      }
    },

    async handleSubmit() {

      const dateError = await this.validateDate();
      const res = await this.$refs.form.validate();

      if (!res.valid || dateError) {
        this.snackbar.message = "Form tidak valid. Silakan periksa kembali.";
        this.snackbar.show = true;
        return
      };

      // Format the open_date and deadline_date
      const openDate = this.formatDate(new Date()); // Current date as open_date
      const formattedDeadline = this.formatDate(this.formData.deadline_date);

      // Validate that deadline_date is after open_date
      if (new Date(formattedDeadline) <= new Date(openDate)) {
        this.snackbar.message = "Deadline date harus diisi setelah open date.";
        this.snackbar.show = true;
        return;
      }

      // Create the payload
      const payload = {
        task_name: this.formData.task_name,
        gitlab_link: this.formData.gitlab_link,
        scope: this.formData.scope,
        module_type: this.formData.module_type,
        problem_type: this.formData.problem_type,
        category: this.formData.category,
        programmer_name: this.formData.programmer_name,
        qa_name: this.formData.qa_name,
        open_date: openDate,
        deadline_date: formattedDeadline,
        task_status: this.formData.task_status,
      };

      // Check if the user is logged in and token is available
      const token = localStorage.getItem("token");
      if (!token) {
        this.$router.push("/login");
        return;
      }

      // Make the API call
      try {
        const response = await fetch("http://localhost:3000/api/v1/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors || "Gagal untuk Menambahkan Task!.");
        }

        this.snackbar.message = "Task Berhasil Ditambahkan!";
        this.snackbar.show = true;
        this.resetForm();
        this.dialog = false;
        this.getAllTasks();
        this.getSummary();
      }
      catch (error) {
        this.snackbar.message = error.message || "Terjadi Error. Coba Kembali!.";
        this.snackbar.show = true;
      }
    },

    async handleUpdate() {

      const formattedDeadline = this.formatDate(this.formData.deadline_date);
      this.formData.deadline_date = formattedDeadline;

      if (this.$refs.form.validate()) {
        const token = localStorage.getItem("token");
        if (!token) {
          this.$router.push("/login");
          return;
        }

        try {
          const response = await fetch(
            `http://localhost:3000/api/v1/task/${this.selectedTask.id}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(this.formData),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || "Gagal untuk Memperbarui Task!.");
          }

          this.snackbar.message = "Task Berhasil Diperbarui!";
          this.snackbar.show = true;
          this.dialog = false;
          this.getAllTasks();
          this.getSummary();
        } catch (error) {
          this.snackbar.message = error.message || "Terjadi Error saat Memperbarui Task!";
          this.snackbar.show = true;
        }
      }
    },

    async handleDetail(item) {
      this.dialogDetail = true;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kamu perlu login untuk melihat task details.");
        this.$router.push("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/task/${item.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.errors || "Gagal untuk fetch task details.");
        }

        const result = await response.json();
        this.taskDetail = result.data;
      } catch (error) {
        // console.error("Error fetching task details:", error.message);
        // alert( error.message || "An error occurred while fetching task details."
        // );
        this.snackbar.message = error.message || "Terjadi Sebuah Error saat Fetching task details.";
        this.snackbar.show = true;
      }
    },

    resetForm() {
      this.formData = {
        task_name: "",
        gitlab_link: "",
        scope: "",
        module_type: "",
        problem_type: "",
        category: "",
        programmer_name: "",
        qa_name: "",
        deadline_date: "",
        task_status: "To Do",
      };
    },

    exportData() {
      // Check token availability
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kamu perlu login untuk menjalankan aksi ini.");
        this.$router.push("/login");
        return;
      }

      // Make API call to download the file
      fetch("http://localhost:3000/api/v1/tasks/download", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Gagal untuk export data. Coba Lagi!.");
          }
          return response.blob(); // Convert response to blob
        })
        .then((blob) => {
          // Create a temporary link for file download
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "tasks_data.csv");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          // console.error("Error exporting data:", error.message);
          // alert("Sebuah error terjadi saat Mengexport data. Coba lagi.");
          this.snackbar.message = error.message || "Terjadi sebuah Error saat Mengexport data.";
          this.snackbar.show = true;
        });
    },

    isTokenExpired(token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
      } catch (error) {
        // console.error("Error decoding token:", error);
        return true;
      }
    },

    async logout() {

      try {
        const response = await fetch('http://localhost:3001/api/v1/logout', {
          // method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (!response.ok) {
          throw new Error('Gagal logout dari server');
        }

        // Jika logout berhasil, hapus token dari localStorage
        localStorage.removeItem("token");

        // Redirect ke halaman login
        this.$router.push("/login");
      } catch (error) {
        // console.error('Error saat logout:', error);
      }
    },

    // Toggle all checkboxes
    toggleCheckAll() {
      if (this.checkAll) {
        this.selectedStatuses = [...this.statusOptions];
      } else {
        this.selectedStatuses = [];
      }
    },

    // Apply the filter (you can customize this function to filter tasks accordingly)
    applyFilter() {
      this.filteredDataTable = this.dataTable.filter(task =>
        this.selectedStatuses.includes(task.task_status)
      );
      this.filterDialog = false;
    },
  },

  watch: {
    selectedStatuses(newVal) {
    this.checkAll = newVal.length === this.statusOptions.length;
    },
    isDatePickerEmpty(newValue) {
    if (newValue) {
      // When isDatePickerEmpty becomes true, listen for changes in the date picker to reset it
      this.$watch(
        () => this.formData.deadline_date,
        (newDate) => {
          if (newDate) {
            this.isDatePickerEmpty = false; // Reset the error state when a new date is selected
          }
        },
        { immediate: true, deep: true }
      );
    }
  },
  },

  computed: {
    taskCounts() {
      const counts = {
        total: this.tasks.length,
        toDo: this.tasks.filter((task) => task.status === "To Do").length,
        doing: this.tasks.filter((task) => task.status === "Doing").length,
        readyToQC: this.tasks.filter((task) => task.status === "Ready to QC")
          .length,
        failed: this.tasks.filter((task) => task.status === "Failed").length,
        done: this.tasks.filter((task) => task.status === "Done").length,
      };
      return counts;
    },
  },
  created() {
    this.getAllTasks();
    this.getSummary();
    this.selectedStatuses = [...this.statusOptions];
  },
};
</script>

<style scoped>
::v-deep(.v-data-table thead) {
  background-color: #2975a5;
}

::v-deep(.v-data-table thead th) {
  color: white;
  font-weight: bold;
}

.rounded-pill {
  display: inline-block;
  padding: 8px 16px;
  border: 2px solid #ddd;
  border-radius: 50%;
  background-color: white;
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1;
}

.full-height {
  background-color: #5088a5;
  height: 100%;
}

.white-bold-text {
  color: white;
  font-weight: bold;
}

.bg-custom {
  background-color: #e2f5ff;
}

.logout-btn {
  position: absolute;
  top: 15px;
  right: 20px;
}

.rounded-input {
  border-radius: 5px;
}

.form-input {
  margin-bottom: 30px;
}

.v-card {
  padding: 24px;
  border-radius: 16px;
}

.v-card-title {
  font-weight: bold;
  font-size: 18px;
}

.error-message {
  line-height: 12px;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
  transition-duration: 150ms;
}

</style>

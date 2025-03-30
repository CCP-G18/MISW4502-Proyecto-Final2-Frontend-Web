provider "google" {
  project = "ccp-mvp"
  region  = "us-central1"
}

resource "google_cloud_run_service" "frontend" {
  name     = "frontend-ccp"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "gcr.io/cloudrun/placeholder"

        ports {
          container_port = 8080
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

output "service_url" {
  value = google_cloud_run_service.frontend.status[0].url
}
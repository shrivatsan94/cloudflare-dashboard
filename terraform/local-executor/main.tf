resource "null_resource" "example1" {
  provisioner "local-exec" {
    command = "echo hi ${var.file_name}"
    interpreter = ["sh", "-Command"]
  }
}
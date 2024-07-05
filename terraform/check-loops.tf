locals {
  minions = ["bob", "kevin", "stewart"]
}

resource "null_resource" "test" {
  provisioner "local-exec" {
    command = "echo hello"
  }
}

resource "null_resource" "minions2" {
  for_each = toset(local.minions)
  provisioner "local-exec" {
    command = "cd terrafo-main-execute; terraform apply -var file_name=${each.value}; cd .."
    interpreter = ["sh", "-Command"]
  }
}

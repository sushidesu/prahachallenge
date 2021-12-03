# ref: https://github.com/pei0804/aws-handson-with-terraform/blob/master/part3/main.tf
variable "aws_access_key" {}
variable "aws_secret_key" {}

provider "aws" {
  access_key = "${var.aws_access_key}"
  secret_key = "${var.aws_secret_key}"
  region = "ap-northeast-1"
}

locals {
  name = "praha"
}

#####
# VPC
#####
resource aws_vpc praha {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "${local.name}-vpc"
  }
}

########
# Subnet
########
# AZ 1a
resource aws_subnet public-1a {
  vpc_id     = aws_vpc.praha.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "ap-northeast-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "${local.name}-public-1a"
  }
}

resource aws_subnet private-1a {
  vpc_id     = aws_vpc.praha.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "ap-northeast-1a"
  map_public_ip_on_launch = false

  tags = {
    Name = "${local.name}-private-1a"
  }
}

# AZ 1c
resource aws_subnet public-1c {
  vpc_id     = aws_vpc.praha.id
  cidr_block = "10.0.3.0/24"
  availability_zone = "ap-northeast-1c"
  map_public_ip_on_launch = true

  tags = {
    Name = "${local.name}-public-1c"
  }
}

resource aws_subnet private-1c {
  vpc_id     = aws_vpc.praha.id
  cidr_block = "10.0.4.0/24"
  availability_zone = "ap-northeast-1c"
  map_public_ip_on_launch = false

  tags = {
    Name = "${local.name}-private-1c"
  }
}



#################
## Security Group
#################
#
## public
resource aws_security_group praha {
  vpc_id      = aws_vpc.praha.id
  name        = local.name
}

resource "aws_security_group_rule" "out" {
  type              = "egress"
  from_port         = -1
  to_port           = -1
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.praha.id
}

resource "aws_security_group_rule" "in_tcp" {
  type = "ingress"
  from_port = 80
  to_port = 80
  cidr_blocks = ["0.0.0.0/0"]
  protocol = "tcp"
  security_group_id = aws_security_group.praha.id
}

resource "aws_security_group_rule" "in_icmp" {
  type = "ingress"
  from_port = -1
  to_port = -1
  cidr_blocks = ["0.0.0.0/0"]
  protocol = "icmp"
  security_group_id = aws_security_group.praha.id
}

###################
## Internet Gateway
###################
resource aws_internet_gateway praha {
  vpc_id = aws_vpc.praha.id
}

##############
## NAT Gateway
##############
#resource aws_eip nat {}
#
#resource aws_nat_gateway praha {
#  subnet_id = aws_subnet.public.id
#  allocation_id = aws_eip.nat.id
#}

##############
## Route Table
##############

## public
resource aws_route_table praha_public {
  vpc_id = aws_vpc.praha.id
  tags = {
    Name = local.name
  }
}

resource aws_route igw {
  route_table_id = aws_route_table.praha_public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.praha.id
}

resource aws_route_table_association praha_public {
  subnet_id = aws_subnet.public-1a.id
  route_table_id = aws_route_table.praha_public.id
}

## private
#resource aws_route_table praha_private {
#  vpc_id = aws_vpc.praha.id
#  tags = {
#    Name = local.name
#  }
#}
#
#resource aws_route nat {
#  route_table_id = aws_route_table.praha_private.id
#  nat_gateway_id = aws_nat_gateway.praha.id
#  destination_cidr_block = "0.0.0.0/0"
#}
#
#resource aws_route_table_association praha_private {
#  subnet_id = aws_subnet.private.id
#  route_table_id = aws_route_table.praha_private.id
#}
#
###############
## EC2 Instance
###############
data aws_ssm_parameter amzn2_ami {
  name = "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
}

resource aws_instance praha {
  ami = data.aws_ssm_parameter.amzn2_ami.value
  instance_type = "t2.micro"
  vpc_security_group_ids = [aws_security_group.praha.id]

  subnet_id = aws_subnet.public-1a.id

  tags = {
    Name = local.name
  }
}

#resource aws_instance private {
#  ami = data.aws_ssm_parameter.amzn2_ami.value
#  instance_type = "t2.micro"
#  iam_instance_profile = aws_iam_instance_profile.praha.id
#  vpc_security_group_ids = [aws_security_group.praha.id]
#
#  subnet_id = aws_subnet.private.id
#
#  tags = {
#    Name = "${local.name}-private"
#  }
#}
#
#
#######################
## IAM Instance Profile
#######################
#resource aws_iam_instance_profile praha {
#  name = local.name
#  role = aws_iam_role.praha.name
#}
#
#resource aws_iam_role praha {
#  name = local.name
#  path = "/"
#
#  assume_role_policy = <<EOF
#{
#    "Version": "2012-10-17",
#    "Statement": [
#        {
#            "Action": "sts:AssumeRole",
#            "Principal": {
#               "Service": "ec2.amazonaws.com"
#            },
#            "Effect": "Allow",
#            "Sid": ""
#        }
#    ]
#}
#EOF
#}
#
#resource aws_iam_role_policy_attachment ssm {
#  role = aws_iam_role.praha.id
#  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
#}
#

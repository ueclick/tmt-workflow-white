#!/bin/bash
##########################################################################
# Script Name: auto_backup_gitlabdata_to_local.sh
# Author: white li
# Email: white.li@6e-group.com
# Created Time: Thu 01 Mar 2017 10:59:26 PM CST
#########################################################################
# Functions:  #
# 
# Define some variables:  #
# Gitlab 档案备份路径
LocalBackDir=/Users/white/gitlab-backup/backups

# Backup server 存储路径
RemoteBackDir=/var/opt/gitlab/backups

# 远程备份使用用户及端口
RemoteUser=root
RemotePort=22

# 备份服务器IP
RemoteIP=47.97.74.50

# 备份时间戳
Date=`date +"%F-%T"`

# 备份日志文件
LogFile=$LocalBackDir/remote_backup.log

# 查找本地备份目录下一天以内且后缀为.tar的Gitlab备份文件
Backfile_Send_To_Remote=$(ssh $RemoteUser@$RemoteIP ls -t $RemoteBackDir | head -1)

echo $Backfile_Send_To_Remote

#Backfile_Send_To_Remote=`find $LocalBackDir -type f -mtime -1 -name '*.tar'`

# 新建备份日志文件
touch $LogFile

# 记录备份日志
echo "${Date} Gitlab auto backup to remote server." >> $LogFile
echo "--------------------------------------------" >> $LogFile

# 打印每次备份的档案名
echo "The files need send to remote server is: $Backfile_Send_To_Remote" >> $LogFile

# 本地传输Gitlab备份档案到远程
scp -P $RemotePort $Backfile_Send_To_Remote $RemoteUser@$RemoteIP:$RemoteBackDir

# 备份结果追加到备份日志
if [ $? -eq 0 ];then
  echo ""
  echo "$Date Gitlab Remote Backup Succeed!" >> $LogFile
else
  echo "$Date Gitlab Remote Backup Failed!" >> $LogFile
fi
创建Gitlab档案备份脚本
#!/bin/bash
##########################################################################
# Script Name: auto_backup_gitlabdata.sh
# Author: wanghui
# Email: yunwei@aniu.tv
# Created Time: Thu 07 Sep 2017 08:59:26 PM CST
#########################################################################
# Blog address: http://blog.csdn.net/wh211212
#########################################################################
# Functions: auto backup gitlab data#
# backup gitlab config
tar cfz /secret/gitlab/backups/$(date "+etc-gitlab-\%s.tgz") -C / etc/gitlab
# backup gitlab os
#/opt/gitlab/bin/gitlab-rake gitlab:backup:create
# gitlab本地备份路径
LocalBackDir=/var/opt/gitlab/backups

# 备份时间戳
Date=`date +"%F-%T"`

# 邮件写入的文件
MailDir=$LocalBackDir/mail
[ -d $MailDir ] || mkdir -p $MailDir
MailContent=$LocalBackDir/mail/mailcontent_$Date

# 邮件发送给谁
MailToUser1=wang@aniu.tv
MailToUser2=jiang@aniu.tv
MailToUser2=shen@aniu.tv

# 备份日志目录
LogDir=$LocalBackDir/log
[ -d $LogDir ] || mkdir -p $LogDir

# 新建日志文件
LogFile=$LocalBackDir/log/backup_$Date.log
touch $LogFile

# 追加日志到日志文件
echo "Gitlab auto backup at local server, start at  $(date +"%Y-%m-%d %H:%M:%S")" >  $LogFile
echo "--------------------------------------------------------------------------" >> $LogFile

# 执行gitlab本地备份功能
#/opt/gitlab/bin/gitlab-rake gitlab:backup:create

# $?符号显示上一条命令的返回值，如果为0则代表执行成功，其他表示失败
if [ $? -eq 0 ];then
   #追加日志到日志文件
   echo "--------------------------------Success!-------------------------------" >> $LogFile
   echo "Gitlab auto backup at local server, end at $(date +"%Y-%m-%d %H:%M:%S")" >> $LogFile

   #写Email的正文内容
   > "$MailContent"
   echo "GitLab Backup Daily Report,backup at local server Success ! Please Check your Email and read the following log file" >> $MailContent

   #读取mailcontent内容当做邮件正文 ，附件为Log文件
   #cat $MailContent | mail -s "Congratulation! GitLab backup at local server Success Report." $MailToUser1 < $LogFile
   cat $MailContent | mail -s "Congratulation! GitLab backup at local server Success Report." -a $LogFile $MailToUser1 -c $MailToUser2 $MailToUser3
else
   #追加日志到日志文件
   echo "--------------------------------Failed!----------------------------------" >> $LogFile
   echo "Gitlab auto backup at local server failed at $(date +"%Y-%m-%d %H:%M:%S")" >> $LogFile

   #写Email的正文内容
   > "$MailContent"
   echo "GitLab Backup Daily Report,Backup at local server failed Failed !  Please Check your Email and read the following log file !" >> $MailContent

   #读取mailcontent内容当做邮件正文附件为Log文件
   cat $MailContent | mail -s "Warning! GitLab Backup at local server Failed Report." -a $LogFile $MailToUser1 -c $MailToUser2 $MailToUser3
fi
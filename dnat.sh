i=220  ; while [ $i -le 245 ] ; do iptables -t nat -I OUTPUT -d 192.168.0.$i/32 -j DNAT --to-destination 192.168.0.9 ; i=$((i+1)) ; done

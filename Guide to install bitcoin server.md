## Install bitcoin node on your droplets
### 1. Download file bitcoin-0.19.1-x86_64-linux-gnu.tar.gz

> `wget https://bitcoincore.org/bin/bitcoin-core-0.19.1/bitcoin-0.19.1-x86_64-linux-gnu.tar.gz`

### 2. Unzip the file

> `tar xzf bitcoin-0.19.1-x86_64-linux-gnu.tar.gz`

### 3. Install bitcoin-core

> `sudo install -m 0755 -o root -g root -t /usr/local/bin bitcoin-0.19.1/bin/*`
> `su -c 'install -m 0755 -o root -g root -t /usr/local/bin bitcoin-0.19.1/bin/*'`

### 4. Initial run for 2 seconds(press Ctrl + C to stop node)

> `bitcoind`

### 5. Modify configuration

> `cd ~/.bitcoin`
> `nano bitcoin.conf`

### 6. Copy and paste following 

> rpcuser=multichainrpc\
> rpcpassword=j3536YzAeJMXRZXLkt94bqmeWYWaKGNjETtDwAN2w6T\
> maxconnections=12\
> rpcport=8332\
> rpcallowip=0.0.0.0/0\
> keypool=10000\
> server=1\
> rest=1\
> txindex=1\

### 7. Press Ctrl+X, Press Y, Press Enter to save this file

### 8. Run bitcoin node

> `bitcoind -daemon`

You must see this message **Bitcoin Core starting**

### 9. That's all

check Port 8333

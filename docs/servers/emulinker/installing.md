# Installing

{{ advanced() }}

## Installing Dependencies

{{ incomplete("section") }}

=== "Ubuntu/Debian"

    ``` bash
    sudo apt-get update
    sudo apt-get upgrade
    sudo apt-get install curl dos2unix openjdk-8-jre nano unzip
    ```

=== "Fedora/RedHat"

    ``` bash
    sudo yum update
    sudo yum install curl dos2unix java-1.8.0-openjdk nano unzip
    ```

## Downloading the Server

{{ incomplete("section") }}

=== "EmuLinkerSF-netsma :material-check-circle-outline:"
    EmulinkerSF-netsma is a fork of EmulinkerSF built specifically for Smash64. It is actively
    maintained by a Smash64 community member, [jonnjonn](https://twitter.com/6kRt62r2zvKp5Rh), and
    the recommended version.

    You can download the latest releases from [here](https://github.com/hopskipnfall/EmuLinkerSF-netsma/releases)
    or use the commands below to download and extract it directly to your Linux server:

    ``` bash
    curl -LO https://github.com/hopskipnfall/EmuLinkerSF-netsma/releases/download/0.4.1/EmuLinkerSF-netsma-0.4.1.zip
    unzip EmuLinkerSF-netsma-0.4.1.zip
    ```

    !!! tip
        For consistency in the rest of the guide, rename the extracted directory with the following:

        ``` bash
        mv EmuLinkerSF-netsma/ emulinker-server/
        ```

=== "EmulinkerSF"
    EmulinkerSF is a modern fork of older Emulinker and Emulinker-X builds. It is somewhat
    actively maintained by the [Kaillera Reborn](https://kaillerareborn.github.io/) community.

    You can download the latest releases from [here](https://github.com/God-Weapon/EmuLinkerSF/releases)
    or use the commands below to download and extract it directly to your Linux server:

    ``` bash
    curl -LO https://github.com/God-Weapon/EmuLinkerSF/releases/download/0.92.9/EmuLinkerSF_v92.9.zip
    unzip EmuLinkerSF_v92.9.zip
    ```

    !!! tip
        For consistency in the rest of the guide, rename the extracted directory with the following:

        ``` bash
        mv EmuLinkerSF/ emulinker-server/
        ```

=== "Emulinker-X :material-alert-outline:"
    Emulinker-X is an older version of Emulinker that was traditionally used by the Smash64
    community. It is no longer maintained and **not recommended** anymore, but it is similar
    enough to modern versions that some instructions will still apply.

    You can download the latest releases from [here](https://github.com/kwilson21/Emulinker-X/releases)
    or use the commands below to download and extract it directly to your Linux server:

    ``` bash
    curl -LO https://github.com/kwilson21/Emulinker-X/releases/download/v2.0.2/EmuLinker.X.v2.0.2.server.zip
    unzip EmuLinker.X.v2.0.2.server.zip
    ```

    !!! tip
        For consistency in the rest of the guide, rename the extracted directory with the following:

        ``` bash
        mv 'EmuLinker X v2.0.2 server'/ emulinker-server/
        ```

## Preparing the Files

{{ incomplete("section") }}

=== "Ubuntu/Debian"

    ``` bash
    cd emulinker-server/
    chmod +x *.sh
    dos2unix *.sh
    ```

=== "Fedora/RedHat"

    ``` bash
    cd emulinker-server/
    chmod +x *.sh
    dos2unix *.sh
    ```

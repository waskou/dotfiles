export PATH="$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"
. "$HOME/.cargo/env"

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/Users/vasko/opt/anaconda3/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/Users/vasko/opt/anaconda3/etc/profile.d/conda.sh" ]; then
        . "/Users/vasko/opt/anaconda3/etc/profile.d/conda.sh"
    else
        export PATH="/Users/vasko/opt/anaconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<
#
export DBUS_SESSION_BUS_ADDRESS="unix:path=$DBUS_LAUNCHD_SESSION_BUS_SOCKET"

alias lazygit="git add . && git commit && git push"

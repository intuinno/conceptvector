from fabric.api import *

# the user to use for the remote commands
env.user = 'intuinno'
# the servers where the commands are executed
env.hosts = ['conceptvector.org']

def pack():
    # create a new source distribution as tarball
    local('python setup.py sdist --formats=gztar', capture=False)

def deploy():
    # figure out the release name and version
    dist = local('python setup.py --fullname', capture=True).strip()
    # upload the source tarball to the temporary folder on the server
    put('dist/%s.tar.gz' % dist, '/tmp/conceptvector.tar.gz')
    # create a place where we can unzip the tarball, then enter
    # that directory and unzip it
    run('mkdir /tmp/conceptvector')
    with cd('/tmp/conceptvector'):
        run('tar xzf /tmp/conceptvector.tar.gz')
        # now setup the package with our virtual environment's
        # python interpreter
        run('/home/intuinno/anaconda2/bin/python setup.py install')
    # now that all is set up, delete the folder again
    run('rm -rf /tmp/conceptvector /tmp/conceptvector.tar.gz')
    # and finally touch the .wsgi file so that mod_wsgi triggers
    # a reload of the application
    run('touch /var/www/conceptvector.wsgi')
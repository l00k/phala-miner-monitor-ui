<?php

namespace Deployer;

require 'recipe/common.php';

set('application', 'phala-miner-monitor');

set('repository', 'git@github.com:l00k/phala-miner-monitor-ui.git');

set('git_tty', true);
set('allow_anonymous_stats', false);

set('assets_path', '/');
set('shared_files', []);
set('shared_dirs', []);
set('clear_paths', [
    'patches',
    'public',
    'src',
]);
set('writable_dirs', []);


host('main')
    ->hostname('100k-dev-server')
    ->user('www-data')
    ->set('deploy_path', '/var/www/html/phala-miner-monitor/ui');


desc('Deploy your project FAST');
task('deploy:fast', [
        'deploy:info',
        'deploy:prepare',
        'deploy:lock',
        'deploy:release',
        'custom:file_upload',
        'deploy:shared',
        'deploy:writable',
        'deploy:clear_paths',
        'deploy:symlink',
        'deploy:unlock',
        'cleanup',
        'success',
]);

desc('Deploy your project');
task('deploy', [
        'deploy:info',
        'deploy:prepare',
        'deploy:lock',
        'deploy:release',
        'custom:asset_build',
        'custom:file_upload',
        'deploy:shared',
        'deploy:writable',
        'deploy:clear_paths',
        'deploy:symlink',
        'deploy:unlock',
        'cleanup',
        'success',
]);

after('deploy:failed', 'deploy:unlock');


task('custom:asset_build', function () {
    if (!empty(get('assets_path', false))) {
        $assetsPath = trim(get('assets_path'), '/\\');
        runLocally('cd ./' . $assetsPath . ' && npm run build');
    }
});

task('custom:file_upload', function () {
    $random = uniqid();
    $compressedFilename = "package-$random.tar.gz";

    $cmd = 'cd ./dist && tar -zcf ../' . $compressedFilename . ' .';
    runLocally($cmd);

    $releaseDir = test('[ -L {{deploy_path}}/release ]')
        ? 'release'
        : 'current';
    $distPath = get('deploy_path') . '/' . $releaseDir;

    upload('./' . $compressedFilename, $distPath);
    runLocally('rm ' . $compressedFilename);

    run('cd ' . $distPath . ' && tar -xf ' . $compressedFilename);
    run('cd ' . $distPath . ' && rm -f ' . $compressedFilename);
});

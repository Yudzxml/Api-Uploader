const fs = require('fs');
const axios = require('axios');
const path = require('path');

async function uploadToGitHub(filePath) {
    const githubToken = process.env.GITHUB_TOKEN;
    const originalFileName = path.basename(filePath);
    const fileContent = fs.readFileSync(filePath, { encoding: 'base64' });

    const repoOwner = 'Yudzxml';
    const repoName = 'Uploader';
    const branch = 'main';
    const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${originalFileName}`;

    try {
        const getResponse = await axios.get(url, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        const sha = getResponse.data.sha;
        await axios.put(url, {
            message: 'Update file',
            content: fileContent,
            sha: sha,
        }, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            await axios.put(url, {
                message: 'Upload new file',
                content: fileContent,
            }, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                },
            });
        } else {
            console.error('Upload error:', error.message);
            throw new Error('Upload to GitHub failed');
        }
    }

    return {
        success: true,
        author: repoOwner,
        message: 'File uploaded successfully',
        result: {
            url: `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${originalFileName}`,
        }
    };
}

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { filePath } = req.body;

        if (!filePath) {
            return res.status(400).json({
                status: 400,
                author: 'Yudzxml',
                error: 'filePath tidak boleh kosong',
            });
        }

        try {
            const result = await uploadToGitHub(filePath);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(500).json({
                status: 500,
                author: 'Yudzxml',
                error: err.message,
            });
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

package vn.tailinh.internmatching.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import vn.tailinh.internmatching.dto.response.files.UploadFileResponse;
import java.io.FileInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;

@Service
public class FileService {
    @Value("${tailinh.upload-file.base-uri}")
    private String baseURI;
    public void createUploadFolder(String folder) throws URISyntaxException {
        Path path = Paths.get(folder);
        File tmpDir = new File(path.toString());
        if (!tmpDir.isDirectory()) {
            try {
                Files.createDirectory(tmpDir.toPath());
                System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + tmpDir.toPath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS");
        }
    }

    public UploadFileResponse store(MultipartFile file, String folder) throws URISyntaxException,
            IOException {
        // create unique filename
        String finalName = System.currentTimeMillis() + "-" + StringUtils.cleanPath(file.getOriginalFilename());
        Path path = Paths.get(baseURI, folder, finalName);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path,
                    StandardCopyOption.REPLACE_EXISTING);
        }
        return new UploadFileResponse(finalName, Instant.now());
    }

    public long getFileLength(String fileName, String folder) throws URISyntaxException {
        Path path = Paths.get(baseURI, folder, fileName);

        File tmpDir = new File(path.toString());

    // If the file does not exist or is a directory => return 0
        if (!tmpDir.exists() || tmpDir.isDirectory())
            return 0;
        return tmpDir.length();
    }

    public InputStreamResource getResource(String fileName, String folder)
            throws URISyntaxException, FileNotFoundException {
        Path path = Paths.get(baseURI, folder, fileName);

        File file = new File(path.toString());
        return new InputStreamResource(new FileInputStream(file));
    }
}

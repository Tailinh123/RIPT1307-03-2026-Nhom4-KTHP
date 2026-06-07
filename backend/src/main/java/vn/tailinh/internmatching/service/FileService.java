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
import vn.tailinh.internmatching.exception.StorageException;

@Service
public class FileService {
    private static final int MAX_STORED_FILE_NAME_LENGTH = 180;

    @Value("${tailinh.upload-file.base-uri}")
    private String baseURI;

    public void createUploadFolder(String folder) throws URISyntaxException {
        Path path = Paths.get(folder);
        File tmpDir = new File(path.toString());
        if (!tmpDir.isDirectory()) {
            try {
                Files.createDirectories(tmpDir.toPath());
                System.out.println(">>> CREATE NEW DIRECTORY SUCCESSFUL, PATH = " + tmpDir.toPath());
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            System.out.println(">>> SKIP MAKING DIRECTORY, ALREADY EXISTS");
        }
    }

    public UploadFileResponse store(MultipartFile file, String folder) throws URISyntaxException,
            IOException, StorageException {
        // create unique filename
        String finalName = buildStoredFileName(file.getOriginalFilename());
        Path path = resolveFilePath(finalName, folder);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path,
                    StandardCopyOption.REPLACE_EXISTING);
        }
        return new UploadFileResponse(finalName, Instant.now());
    }

    private String buildStoredFileName(String originalFilename) {
        String cleanedName = StringUtils.cleanPath(originalFilename == null ? "file" : originalFilename)
                .replace("\\", "-")
                .replace("/", "-");
        if (cleanedName.isBlank()) {
            cleanedName = "file";
        }

        String timestamp = String.valueOf(System.currentTimeMillis());
        int maxOriginalLength = MAX_STORED_FILE_NAME_LENGTH - timestamp.length() - 1;
        if (cleanedName.length() <= maxOriginalLength) {
            return timestamp + "-" + cleanedName;
        }

        int dotIndex = cleanedName.lastIndexOf(".");
        String baseName = cleanedName;
        String extension = "";
        if (dotIndex > 0 && dotIndex < cleanedName.length() - 1) {
            baseName = cleanedName.substring(0, dotIndex);
            extension = cleanedName.substring(dotIndex);
        }

        int maxBaseLength = Math.max(1, maxOriginalLength - extension.length());
        if (baseName.length() > maxBaseLength) {
            baseName = baseName.substring(0, maxBaseLength);
        }
        return timestamp + "-" + baseName + extension;
    }

    public long getFileLength(String fileName, String folder) throws URISyntaxException, StorageException {
        Path path = resolveFilePath(fileName, folder);

        File tmpDir = new File(path.toString());

        // If the file does not exist or is a directory
        if (!tmpDir.exists() || tmpDir.isDirectory())
            return 0;
        return tmpDir.length();
    }

    public InputStreamResource getResource(String fileName, String folder)
            throws URISyntaxException, FileNotFoundException, StorageException {
        Path path = resolveFilePath(fileName, folder);

        File file = new File(path.toString());
        return new InputStreamResource(new FileInputStream(file));
    }

    private Path resolveFilePath(String fileName, String folder) throws StorageException {
        String cleanFolder = StringUtils.cleanPath(folder == null ? "" : folder);
        String cleanFileName = StringUtils.cleanPath(fileName == null ? "" : fileName);
        if (cleanFolder.isBlank() || cleanFileName.isBlank()) {
            throw new StorageException("Invalid file path");
        }
        if (cleanFolder.contains("..") || cleanFolder.contains("/") || cleanFolder.contains("\\") || cleanFolder.contains("~")) {
            throw new StorageException("Invalid file path");
        }
        if (cleanFileName.contains("..") || cleanFileName.contains("/") || cleanFileName.contains("\\") || cleanFileName.contains("~")) {
            throw new StorageException("Invalid file path");
        }
        Path folderPath = Paths.get(baseURI, cleanFolder).normalize().toAbsolutePath();
        Path filePath = folderPath.resolve(cleanFileName).normalize().toAbsolutePath();
        if (!filePath.startsWith(folderPath)) {
            throw new StorageException("Invalid file path");
        }
        return filePath;
    }
}

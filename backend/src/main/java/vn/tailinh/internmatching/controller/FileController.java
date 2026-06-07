package vn.tailinh.internmatching.controller;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.response.files.UploadFileResponse;
import vn.tailinh.internmatching.entity.Resume;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.exception.StorageException;
import vn.tailinh.internmatching.repository.ResumeRepository;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.security.SecurityUtils;
import vn.tailinh.internmatching.service.FileService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLDecoder;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping(path = "${apiPrefix}/files")
@RequiredArgsConstructor
public class FileController {
  private final FileService fileService;
  private final UserRepository userRepository;
  private final ResumeRepository resumeRepository;
  @Value("${tailinh.upload-file.base-uri}")
  private String baseURI;

  @PostMapping("")
  @ApiMessage("Upload single file")
  public ResponseEntity<UploadFileResponse> upload(
      @RequestParam(name = "file", required = false) MultipartFile file,
      @RequestParam("folder") String folder) throws URISyntaxException, IOException, StorageException {
    if (file == null || file.isEmpty()) {
      throw new StorageException("File is empty, please up load a file");
    }

    if (folder.contains("..") || folder.contains("~")) {
      throw new StorageException("Invalid folder path");
    }

    String fileName = file.getOriginalFilename();
    List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx");
    boolean isValid = allowedExtensions.stream().anyMatch(
        item -> fileName.toLowerCase().endsWith(item));

    if (!isValid) {
      throw new StorageException("Invalid file extension. Only allows " + allowedExtensions.toString());
    }

    this.fileService.createUploadFolder(baseURI + folder);
    return ResponseEntity.ok().body(this.fileService.store(file, folder));
  }


  
  @GetMapping("")
  @ApiMessage("Download a file")
  public ResponseEntity<Resource> download(
      @RequestParam(name = "fileName", required = false) String fileName,
      @RequestParam(name = "folder", required = false) String folder)
      throws StorageException, URISyntaxException, FileNotFoundException {
    if (fileName == null || folder == null) {
      throw new StorageException("Missing required params : (fileName or folder) in query params.");
    }

    if (folder.contains("..") || folder.contains("~")) {
      throw new StorageException("Invalid folder path");
    }
    this.checkDownloadPermission(fileName, folder);

    // check file exist (and not a directory)
    long fileLength = this.fileService.getFileLength(fileName, folder);
    if (fileLength == 0) {
      throw new StorageException("File with name = " + fileName + " not found.");
    }

    // download a file
    InputStreamResource resource = this.fileService.getResource(fileName, folder);

    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
        .contentLength(fileLength)
        .contentType(MediaType.APPLICATION_OCTET_STREAM)
        .body(resource);
  }

  private void checkDownloadPermission(String fileName, String folder) throws StorageException {
    if (!"resume".equals(folder)) {
      return;
    }
    String requestedFileName = extractStoredFileName(fileName);
    String email = SecurityUtils.getCurrentUserLogin().orElse("");
    User currentUser = this.userRepository.findByEmail(email);
    if (currentUser == null || currentUser.getRole() == null) {
      throw new StorageException("You don't have permission to download this file");
    }
    String roleName = currentUser.getRole().getName();
    if ("SUPER_ADMIN".equals(roleName)) {
      return;
    }
    if ("CANDIDATE".equals(roleName) && hasResumeFile(
        this.resumeRepository.findByUserId(currentUser.getId()),
        requestedFileName)) {
      return;
    }
    if ("HR_MANAGER".equals(roleName)
        && currentUser.getCompany() != null
        && hasResumeFile(
            this.resumeRepository.findDistinctByApplicationsJobCompanyId(currentUser.getCompany().getId()),
            requestedFileName)) {
      return;
    }
    throw new StorageException("You don't have permission to download this file");
  }

  private boolean hasResumeFile(List<Resume> resumes, String requestedFileName) {
    return resumes.stream()
        .map(Resume::getUrl)
        .filter(Objects::nonNull)
        .map(this::extractStoredFileName)
        .anyMatch(requestedFileName::equals);
  }

  private String extractStoredFileName(String rawUrl) {
    if (rawUrl == null) {
      return "";
    }
    String normalizedUrl = rawUrl
        .replace("\\", "/")
        .replaceFirst("^https?://[^/]+", "");

    int queryStart = normalizedUrl.indexOf('?');
    if (queryStart >= 0 && queryStart < normalizedUrl.length() - 1) {
      String query = normalizedUrl.substring(queryStart + 1);
      for (String param : query.split("&")) {
        String[] pair = param.split("=", 2);
        if (pair.length == 2 && "fileName".equals(pair[0])) {
          return decodeFileName(pair[1]);
        }
      }
      normalizedUrl = normalizedUrl.substring(0, queryStart);
    }

    int slashIndex = normalizedUrl.lastIndexOf("/");
    if (slashIndex >= 0 && slashIndex < normalizedUrl.length() - 1) {
      normalizedUrl = normalizedUrl.substring(slashIndex + 1);
    }
    return decodeFileName(normalizedUrl);
  }

  private String decodeFileName(String fileName) {
    return URLDecoder.decode(fileName, StandardCharsets.UTF_8);
  }
}

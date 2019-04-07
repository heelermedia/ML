using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Diagnostics;

namespace Browsing
{
    /// <summary>
    /// Directory browsing api
    /// </summary>
    public class Browser : IBrowser
    {
        private const string _defaultDirectory = @"C:\\Projects\\EpocFrames\\EpocFrames\\EpocFrames.Server";
        private static List<string> hiddenSections = new List<string> { "bin", "app_data" };

        public Browser()
        {
        }
        /// <summary>
        /// Creates a Node with n children to enable drilling down into directories
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public Node GetBrowserNodes(string path, string searchPattern = null)
        {
            if (string.IsNullOrEmpty(path) || path.Equals("/")) path = _defaultDirectory;
            DirectoryInfo directoryInfo = new DirectoryInfo(path);
            Node rootNode = CreateRootNode(directoryInfo);
            rootNode.Children = new List<Node>();
            List<Node> directories = CreateDirectoryNodes(directoryInfo, searchPattern);
            rootNode.DirectoryCount = directories.Count();
            rootNode.Children.AddRange(directories);
            List<Node> files = CreateFileNodes(directoryInfo, searchPattern);
            rootNode.FileCount = files.Count();
            rootNode.Children.AddRange(files);
            return rootNode;
        }
        /// <summary>
        /// Upload file(s)
        /// </summary>
        /// <param name="fileUpload"></param>
        /// <returns></returns>
        public async Task<Node> UploadFilesAsync(FileUpload fileUpload)
        {
            long size = fileUpload.Files.Sum(f => f.Length);
            string path = fileUpload.Path;

            foreach (IFormFile formFile in fileUpload.Files)
            {
                if (formFile.Length > 0)
                {
                    using (var stream = new FileStream(Path.Combine(path, Path.GetFileName(formFile.FileName)), FileMode.Create))
                    {
                        await formFile.CopyToAsync(stream);
                    }
                }
            }

            return GetBrowserNodes(path);
        }
        /// <summary>
        /// Remove files or directories
        /// </summary>
        /// <param name="removeNodes"></param>
        /// <returns></returns>
        public void DeleteNodes(RemoveNodes removeNodes)
        {
            foreach (Node node in removeNodes.NodesToRemove)
            {
                if (node.IsFile)
                {
                    FileInfo fileInfo = new FileInfo(node.Path);
                    if (fileInfo.Exists)
                    {
                        fileInfo.Delete();
                    }
                }
                else
                {
                    DirectoryInfo directoryInfo = new DirectoryInfo(node.Path);
                    if (directoryInfo.Exists)
                    {
                        directoryInfo.Delete(true);
                    }
                }

            }
        }
        /// <summary>
        /// Move files or directories
        /// </summary>
        /// <param name="moveNodes"></param>
        /// <returns></returns>
        public Node MoveNodes(MoveNodes moveNodes)
        {
            string path = moveNodes.ToNode.Path;
            foreach (Node node in moveNodes.NodesToMove)
            {
                string target = $"{path}/{node.Name}";
                if (node.IsFile)
                {
                    FileInfo fileInfo = new FileInfo(node.Path);
                    if (fileInfo.Exists && File.Exists(target) == false)
                    {
                        File.Move(node.Path, target);
                    }
                }
                else
                {
                    DirectoryInfo directoryInfo = new DirectoryInfo(node.Path);
                    if (directoryInfo.Exists && Directory.Exists(target) == false)
                    {
                        Directory.Move(node.Path, target);
                    }
                }
            }
            return GetBrowserNodes(path);
        }
        /// <summary>
        /// Copies a file or a directory
        /// </summary>
        /// <param name="copyNodes"></param>
        /// <returns></returns>
        public async Task<Node> CopyNodesAsync(CopyNodes copyNodes)
        {
            string path = copyNodes.ToNode.Path;
            if (copyNodes.ToNode.IsFile)
            {
                path = copyNodes.ToNode.Parent;
            }
            foreach (Node node in copyNodes.NodesToCopy)
            {
                string target = string.Empty;
                if (node.IsFile)
                {
                    string extension = Path.GetExtension(node.Name);
                    target = $"{path}/{Path.GetFileNameWithoutExtension(node.Path)}_copy{extension}";
                    if (File.Exists(target) == false)
                    {
                        using (FileStream source = File.Open(node.Path, FileMode.Open))
                        {
                            using (FileStream destination = File.Create(target))
                            {
                                await source.CopyToAsync(destination);
                            }
                        }
                    }
                }
                else
                {
                    CopyDirectory(path, $"{path}_copy", true);
                }
            }
            return copyNodes.ToNode.IsFile ? GetBrowserNodes(path) : GetBrowserNodes(copyNodes.ToNode.Parent);
        }
        /// <summary>
        /// Create a directory
        /// </summary>
        /// <param name="createDirectory"></param>
        /// <returns></returns>
        public Node CreateDirectory(CreateDirectory createDirectory)
        {
            string path = $"{createDirectory.Path}/{createDirectory.Name}";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            return GetBrowserNodes(path);
        }
        /// <summary>
        /// Create the root node for browsing
        /// </summary>
        /// <param name="directoryInfo"></param>
        /// <returns></returns>
        private Node CreateRootNode(DirectoryInfo directoryInfo)
        {
            if (directoryInfo.Exists)
            {
                return new Node
                {
                    Path = directoryInfo.FullName,
                    Parent = directoryInfo.Parent?.FullName,
                    Root = directoryInfo.Root.FullName,
                    Name = directoryInfo.Name,
                    IsFile = false,
                    Size = GetBytesSize(directoryInfo.FullName, false),
                    HasChildren = directoryInfo.EnumerateFileSystemInfos("*", SearchOption.TopDirectoryOnly).Any()
                };
            }
            else
            {
                string path = directoryInfo.FullName;
                MemoryStream ms = new MemoryStream();
                using (StreamReader reader = new StreamReader(path))
                {
                    reader.BaseStream.CopyTo(ms);
                }
                return new Node
                {
                    Path = directoryInfo.FullName,
                    Parent = directoryInfo.Parent?.FullName,
                    Root = directoryInfo.Root.FullName,
                    Name = directoryInfo.Name,
                    IsFile = true,
                    Size = GetBytesSize(directoryInfo.FullName, true),
                    HasChildren = false,
                    Content = Encoding.UTF8.GetString(ms.GetBuffer())
                };
            }

        }
        /// <summary>
        /// Create directory nodes
        /// </summary>
        /// <param name="directoryInfo"></param>
        /// <returns></returns>
        private List<Node> CreateDirectoryNodes(DirectoryInfo directoryInfo, string searchPattern = null)
        {
            searchPattern = ToSearchPattern(searchPattern);
            List<Node> directoryNodes = new List<Node>();
            if (directoryInfo.Exists)
            {
                IEnumerable<DirectoryInfo> directoryInfos = directoryInfo.EnumerateDirectories(searchPattern, SearchOption.TopDirectoryOnly);
                foreach (DirectoryInfo dirInfo in directoryInfos)
                {
                    try
                    {
                        if (!hiddenSections.Contains(dirInfo.Name.ToLower()))
                        {
                            directoryNodes.Add(new Node
                            {
                                Path = dirInfo.FullName,
                                Parent = dirInfo.Parent.FullName,
                                Root = dirInfo.Root.FullName,
                                Name = dirInfo.Name,
                                IsFile = false,
                                Size = GetBytesSize(dirInfo.FullName, false),
                                HasChildren = dirInfo.EnumerateFileSystemInfos("*", SearchOption.TopDirectoryOnly).Any()
                            });
                        }
                    }
                    //there will be an error, likely permissions, on some directory for sure so just
                    //continue if there is one
                    catch (UnauthorizedAccessException e)
                    {
                        Debug.WriteLine(e.Message);
                        continue;
                    }
                    catch (DirectoryNotFoundException e)
                    {
                        Debug.WriteLine(e.Message);
                        continue;
                    }
                    catch (Exception e)
                    {
                        Debug.WriteLine(e.Message);
                        continue;
                    }
                }
            }
            return directoryNodes;
        }
        /// <summary>
        /// Create file nodes
        /// </summary>
        /// <param name="directoryInfo"></param>
        /// <returns></returns>
        private List<Node> CreateFileNodes(DirectoryInfo directoryInfo, string searchPattern = null)
        {
            searchPattern = ToSearchPattern(searchPattern);
            List<Node> fileNodes = new List<Node>();
            if (directoryInfo.Exists)
            {
                IEnumerable<FileInfo> filesInfos = directoryInfo.EnumerateFiles(searchPattern, SearchOption.TopDirectoryOnly);
                foreach (FileInfo fileInfo in filesInfos)
                {
                    try
                    {
                        fileNodes.Add(new Node
                        {
                            Path = fileInfo.FullName,
                            Parent = fileInfo.Directory.FullName,
                            Root = fileInfo.Directory.Root.FullName,
                            Name = fileInfo.Name,
                            Size = GetBytesSize(fileInfo.FullName, true),
                            IsFile = true
                        });
                    }
                    //there will be an error, likely permissions, on some directory for sure so just
                    //continue if there is one
                    catch (UnauthorizedAccessException e)
                    {
                        System.Diagnostics.Debug.WriteLine(e.Message);
                        continue;
                    }
                    catch (DirectoryNotFoundException e)
                    {
                        System.Diagnostics.Debug.WriteLine(e.Message);
                        continue;
                    }
                    catch (Exception e)
                    {
                        System.Diagnostics.Debug.WriteLine(e.Message);
                        continue;
                    }
                }
            }
            return fileNodes;
        }
        /// <summary>
        /// Convert text into a search pattern
        /// </summary>
        /// <param name="searchPattern"></param>
        /// <returns></returns>
        private string ToSearchPattern(string searchPattern)
        {
            if (string.IsNullOrEmpty(searchPattern)) searchPattern = "*";
            else searchPattern = $"*{searchPattern}*";
            return searchPattern;
        }
        /// <summary>
        /// Get file bytes for downloading a file
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public byte[] DownloadFile(string path)
        {
            byte[] bytes = File.ReadAllBytes(path);
            return bytes;
        }
        /// <summary>
        /// Get nodes via search 
        /// </summary>
        /// <param name="search"></param>
        /// <returns></returns>
        public Node Search(Search search)
        {
            return GetBrowserNodes(search.Path, search.SearchText);
        }
        /// <summary>
        /// Get file or directory size in bytes
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        private long GetBytesSize(string path, bool isFile)
        {
            long size = 0;
            if (isFile)
            {
                size = new FileInfo(path).Length;
            }
            else
            {
                DirectoryInfo directoryInfo = new DirectoryInfo(path);
                try
                {
                    IEnumerable<FileInfo> filesInfos = directoryInfo.EnumerateFiles("*", SearchOption.TopDirectoryOnly);
                    foreach (FileInfo fileInfo in filesInfos)
                    {
                        size += fileInfo.Length;
                    }
                }
                catch (UnauthorizedAccessException e)
                {
                    System.Diagnostics.Debug.WriteLine(e.Message);
                }
                catch (DirectoryNotFoundException e)
                {
                    System.Diagnostics.Debug.WriteLine(e.Message);
                }
                catch (Exception e)
                {
                    System.Diagnostics.Debug.WriteLine(e.Message);
                }
            }
            return size;
        }
        /// <summary>
        /// Copy directories 
        /// </summary>
        /// <param name="sourceDirName"></param>
        /// <param name="destDirName"></param>
        /// <param name="copySubDirs"></param>
        private void CopyDirectory(string sourceDirName, string destDirName, bool copySubDirs)
        {
            DirectoryInfo dir = new DirectoryInfo(sourceDirName);

            DirectoryInfo[] dirs = dir.GetDirectories();
            if (!Directory.Exists(destDirName))
            {
                Directory.CreateDirectory(destDirName);
            }

            FileInfo[] files = dir.GetFiles();
            foreach (FileInfo file in files)
            {
                string temppath = Path.Combine(destDirName, file.Name);
                file.CopyTo(temppath, false);
            }

            if (copySubDirs)
            {
                foreach (DirectoryInfo subdir in dirs)
                {
                    string temppath = Path.Combine(destDirName, subdir.Name);
                    CopyDirectory(subdir.FullName, temppath, copySubDirs);
                }
            }
        }
    }
}

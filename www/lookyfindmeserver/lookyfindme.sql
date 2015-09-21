-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 18, 2015 at 08:21 PM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `lookyfindme`
--

-- --------------------------------------------------------

--
-- Table structure for table `friend`
--

CREATE TABLE IF NOT EXISTS `friend` (
`friend_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_one` varchar(100) NOT NULL,
  `friend_status` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `friend`
--

INSERT INTO `friend` (`friend_id`, `user_id`, `friend_one`, `friend_status`) VALUES
(1, 2, 'dannyboy', 3),
(2, 2, 'jimmy', 2),
(3, 2, 'bobby', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
`user_id` int(11) NOT NULL,
  `user_name` varchar(25) NOT NULL,
  `user_password` varchar(25) NOT NULL,
  `user_username` varchar(25) NOT NULL,
  `user_surname` varchar(25) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `user_name`, `user_password`, `user_username`, `user_surname`) VALUES
(1, 'Daniel', '123', 'dannyboy', 'Makgonta'),
(2, 'Mamelo', '123', 'mamelo', 'Seopela'),
(5, 'bobby', '123', 'bobby', 'man'),
(6, 'alex', '123', 'alex', 'voss'),
(7, 'jimmy', '123', 'jimmy', 'choo');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friend`
--
ALTER TABLE `friend`
 ADD PRIMARY KEY (`friend_id`), ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
 ADD PRIMARY KEY (`user_id`), ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friend`
--
ALTER TABLE `friend`
MODIFY `friend_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `friend`
--
ALTER TABLE `friend`
ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

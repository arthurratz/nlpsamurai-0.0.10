CREATE DATABASE IF NOT EXISTS `nlp-samurai_db`;
USE `nlp-samurai_db`;
-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: nlp-samurai_db
-- ------------------------------------------------------
-- Server version	8.0.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actions`
--

DROP TABLE IF EXISTS `actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `actions` (
  `action_id` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  PRIMARY KEY (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actions`
--

LOCK TABLES `actions` WRITE;
/*!40000 ALTER TABLE `actions` DISABLE KEYS */;
INSERT INTO `actions` VALUES (1,'create'),(2,'creating'),(3,'creation'),(4,'created'),(5,'edit'),(6,'editing'),(7,'edited'),(8,'add'),(9,'addition'),(10,'adding'),(11,'added'),(12,'onboard'),(13,'onboarding'),(14,'onboarded'),(15,'delete'),(16,'deleting'),(17,'deletion'),(18,'deleted'),(19,'get started'),(20,'getting started'),(21,'got started'),(22,'invite'),(23,'inviting'),(24,'invitation'),(25,'invited');
/*!40000 ALTER TABLE `actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answers`
--

DROP TABLE IF EXISTS `answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `answers` (
  `answer_id` int(11) NOT NULL AUTO_INCREMENT,
  `answer` blob NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`answer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answers`
--

LOCK TABLES `answers` WRITE;
/*!40000 ALTER TABLE `answers` DISABLE KEYS */;
INSERT INTO `answers` VALUES (1,_binary 'If you\'re interested in creating a new workspace or want some help managing one, this guide was designed with you in mind. \nDon\'t miss our What is Slack guide if you\'d like a refresher before you get going. Or, if you actually want to join an existing workspace, perhaps our Getting started for new users guide is where you want to be instead!\nOK, let\'s go!','https://get.slack.help/hc/en-us/articles/217626298-Getting-started-for-workspace-creators'),(2,_binary 'A shared channel (beta) is a bridge connecting your workspace with another company\'s Slack workspace. Shared channels, public or private, are a secure place to communicate and collaborate with external contacts.','https://get.slack.help/hc/en-us/articles/115004151203-Create-shared-channels-on-a-workspace-beta-'),(3,_binary 'Help your teammates learn more about you by completing your profile. By default, everyone can add the following to their profile: a name, job description or title, phone number, and time zone.','https://get.slack.help/hc/en-us/articles/204092246-Edit-your-profile'),(4,_binary 'Whether you\'re introducing Slack to 500 people or 500,000, onboarding large groups is no easy task. This guide will help you introduce Slack to your company in a meaningful way.','https://get.slack.help/hc/en-us/articles/115004378828-Onboard-your-company-to-Slack-'),(5,_binary 'Workspace Owners and Workspace Admins can delete any channel that they\'ve joined, with the exception of the general channel. Deleting a channel removes it from a workspace. Alternatively, Workspace Owners and Workspace Admins can choose to archive a channel to preserve the channel\'s history. ','https://get.slack.help/hc/en-us/articles/213185307-Delete-a-channel'),(6,_binary 'Slack is most useful when all your teammates, tools, and work are in one place. By adding apps to Slack, you can connect your most important tools, centralize all your work, and say goodbye to juggling all those windows. ','https://get.slack.help/hc/en-us/articles/202035138-Add-an-app-to-your-workspace'),(7,_binary 'Creating guidelines for naming channels is one of the best ways to keep your workspace organized. By using clear, predictable guidelines, members are more likely to ask questions in the right places, connect with the right people, and feel empowered to work efficiently in Slack.','https://get.slack.help/hc/en-us/articles/217626408-Create-guidelines-for-channel-names'),(8,_binary 'Because you\'re already familiar with what Slack is all about (and you\'ve seen the demo), we\'ll now show you how to get started. How you proceed depends on how you\'ll be using Slack: either as an individual member or the workspace creator.','https://get.slack.help/hc/en-us/articles/218080037-Getting-started-for-new-members'),(9,_binary 'Whether your Slack workspace is brand new or has been around for a while, this article will walk you through how to invite others to join.','https://get.slack.help/hc/en-us/articles/201330256-Invite-new-members-to-your-workspace');
/*!40000 ALTER TABLE `answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `concepts`
--

DROP TABLE IF EXISTS `concepts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `concepts` (
  `concept_id` int(11) NOT NULL AUTO_INCREMENT,
  `action_id` int(11) NOT NULL,
  `entity_id` int(11) NOT NULL,
  `desc` text,
  `negative` int(11) NOT NULL,
  `answer_id` int(11) NOT NULL,
  PRIMARY KEY (`concept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `concepts`
--

LOCK TABLES `concepts` WRITE;
/*!40000 ALTER TABLE `concepts` DISABLE KEYS */;
INSERT INTO `concepts` VALUES (1,1,1,'NULL',0,1),(2,2,1,'NULL',0,1),(3,3,1,'NULL',0,1),(4,4,1,'NULL',0,1),(5,1,2,'NULL',0,2),(6,2,2,'NULL',0,2),(7,3,2,'NULL',0,2),(8,4,2,'NULL',0,2),(9,15,2,'NULL',0,5),(10,16,2,'NULL',0,5),(11,17,2,'NULL',0,5),(12,18,2,'NULL',0,5),(13,8,3,'NULL',0,6),(14,9,3,'NULL',0,6),(15,10,3,'NULL',0,6),(16,12,4,'NULL',0,4),(17,13,4,'NULL',0,4),(18,14,4,'NULL',0,4),(19,5,5,'NULL',0,3),(20,6,5,'NULL',0,3),(21,7,5,'NULL',0,3),(22,1,6,'NULL',0,7),(23,2,6,'NULL',0,7),(24,3,6,'NULL',0,7),(25,4,6,'NULL',0,7),(26,1,7,'NULL',0,7),(27,2,7,'NULL',0,7),(28,3,7,'NULL',0,7),(29,4,7,'NULL',0,7),(30,22,8,'NULL',0,9),(31,23,8,'NULL',0,9),(32,24,8,'NULL',0,9),(33,25,8,'NULL',0,9),(34,19,8,'NULL',0,8),(35,20,8,'NULL',0,8),(36,21,8,'NULL',0,8);
/*!40000 ALTER TABLE `concepts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `concepts_view`
--

DROP TABLE IF EXISTS `concepts_view`;
/*!50001 DROP VIEW IF EXISTS `concepts_view`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `concepts_view` AS SELECT 
 1 AS `concept_id`,
 1 AS `action`,
 1 AS `entity`,
 1 AS `desc`,
 1 AS `negative`,
 1 AS `answer`,
 1 AS `url`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `entities`
--

DROP TABLE IF EXISTS `entities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `entities` (
  `entity_id` int(11) NOT NULL AUTO_INCREMENT,
  `entity` varchar(255) NOT NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entities`
--

LOCK TABLES `entities` WRITE;
/*!40000 ALTER TABLE `entities` DISABLE KEYS */;
INSERT INTO `entities` VALUES (1,'workspace'),(2,'channel'),(3,'application'),(4,'company'),(5,'profile'),(6,'guidelines'),(7,'names'),(8,'members');
/*!40000 ALTER TABLE `entities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'nlp-samurai_db'
--

--
-- Dumping routines for database 'nlp-samurai_db'
--

--
-- Final view structure for view `concepts_view`
--

/*!50001 DROP VIEW IF EXISTS `concepts_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `concepts_view` AS select `concepts`.`concept_id` AS `concept_id`,`actions`.`action` AS `action`,`entities`.`entity` AS `entity`,`concepts`.`desc` AS `desc`,`concepts`.`negative` AS `negative`,`answers`.`answer` AS `answer`,`answers`.`url` AS `url` from (((`concepts` join `actions` on((`concepts`.`action_id` = `actions`.`action_id`))) join `entities` on((`concepts`.`entity_id` = `entities`.`entity_id`))) join `answers` on((`concepts`.`answer_id` = `answers`.`answer_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-14 18:09:43

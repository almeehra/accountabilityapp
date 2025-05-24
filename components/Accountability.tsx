"use client";

import React, { useEffect } from "react";
import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { ConnectButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "../utils/contracts";
import { Deposit } from "./Deposit";
import { toEther } from "thirdweb";
import { TasksList } from "./TasksList";
import { AddTask } from "./AddTask";

export const Accountability = () => {
    const account = useActiveAccount();
    
    const { data: depositAmount, isLoading: isLoadingDeposit, error: depositError } = useReadContract({
        contract: contract,
        method: "getDeposit",
    });
    
    const { data: taskCount, isLoading: isLoadingTaskCount, error: taskCountError } = useReadContract({
        contract: contract,
        method: "getTaskCount"
    });
    
    // Log states for debugging
    useEffect(() => {
        console.log("Account:", account);
        console.log("Deposit Amount:", depositAmount, "Loading:", isLoadingDeposit, "Error:", depositError);
        console.log("Task Count:", taskCount, "Loading:", isLoadingTaskCount, "Error:", taskCountError);
    }, [account, depositAmount, isLoadingDeposit, depositError, taskCount, isLoadingTaskCount, taskCountError]);
    
    // Convert to string safely to avoid undefined issues
    const depositStr = depositAmount?.toString() || "0";
    const taskCountStr = taskCount?.toString() || "0";
    
    if (!account) {
        return (
            <div style={{ textAlign: "center", minWidth: "500px" }} >
                <h2>Please connect your wallet</h2>
                <ConnectButton client={client} chain={chain} />
            </div>
        );
    }
    
    // Show specific loading messages
    if (isLoadingDeposit) {
        return (
            <div style={{ textAlign: "center", minWidth: "500px" }}>
                <ConnectButton client={client} chain={chain} />
                <p>Loading deposit data...</p>
            </div>
        );
    }
    
    if (isLoadingTaskCount) {
        return (
            <div style={{ textAlign: "center", minWidth: "500px" }}>
                <ConnectButton client={client} chain={chain} />
                <p>Loading task count data...</p>
            </div>
        );
    }
    
    // Error states
    if (depositError) {
        return (
            <div style={{ textAlign: "center", minWidth: "500px" }}>
                <ConnectButton client={client} chain={chain} />
                <p>Error loading deposit: {depositError.message}</p>
            </div>
        );
    }
    
    if (taskCountError) {
        return (
            <div style={{ textAlign: "center", minWidth: "500px" }}>
                <ConnectButton client={client} chain={chain} />
                <p>Error loading task count: {taskCountError.message}</p>
            </div>
        );
    }
    
    return (
        <div style={{ textAlign: "center", minWidth: "500px" }}>
            <ConnectButton client={client} chain={chain} />
            
            <div>
                {/* Debug info */}
                <div style={{ fontSize: "12px", marginTop: "10px", color: "gray" }}>
                    <p>Deposit: {depositStr}</p>
                    <p>Task Count: {taskCountStr}</p>
                </div>
                
                {depositStr !== "0" && taskCountStr === "0" ? (
                    <TasksList />
                ) : depositStr === "0" && taskCountStr === "0" ? (
                    <Deposit />
                ) : (
                    <div style={{ marginTop: "20px" }}>
                        <h3>Locked Funds: {depositAmount ? toEther(depositAmount) : '0'}</h3>
                        <p style={{ fontSize: "12px"}}>Funds will be returned once all tasks are completed.</p>
                        <AddTask />
                        <TasksList />
                    </div>
                )}
            </div>
        </div>
    );
};
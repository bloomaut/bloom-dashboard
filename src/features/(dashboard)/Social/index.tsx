"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProfile,
  selectSocialMediaProfile,
  selectIsLoading,
  selectSocialMediaError,
  clearError,
} from "@/features/(dashboard)/Social/store/socialMediaSlice";
import { SocialMediaSetup } from "@/features/(dashboard)/Social/components/SocialMediaSetup";
import { SocialMediaDashboard } from "@/features/(dashboard)/Social/components/SocialMediaDashboard";
import { useMessageToast } from "@/hooks/useMessageToast";
import styles from "./styles/dashboardSocial.module.scss";

export default function SocialMediaPage() {
  const dispatch = useAppDispatch();
  const { notifyError } = useMessageToast();

  // Redux selectors
  const profile = useAppSelector(selectSocialMediaProfile);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectSocialMediaError);

  // Fetch profile on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      notifyError(error);
      dispatch(clearError());
    }
  }, [error, notifyError, dispatch]);

  // Show loading state
  if (isLoading && !profile) {
    return (
      <div className={styles.loadingContainer} id='social-media-page'>
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Determine if user has connected accounts
  const hasConnectedAccounts = profile?.connected_accounts?.instagram || profile?.connected_accounts?.tiktok;

  return (
    <div className={styles.socialMediaPage} id='social-media-page'>
      {!hasConnectedAccounts ? <SocialMediaSetup /> : <SocialMediaDashboard />}
    </div>
  );
}
